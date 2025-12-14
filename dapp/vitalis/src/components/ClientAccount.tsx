import { useState, useEffect } from "react";
import { Box, Button, Card, Flex, Heading, Text, Badge, Dialog } from "@radix-ui/themes";
import { ConnectButton } from "@mysten/dapp-kit";
import { getClientData, getReservations, cancelReservation, type Reservation } from "../clientStorage";
import { type LocalClient } from "../clientStorage";
import { businesses } from "../businesses";
import { useVitalisTransactions } from "../useVitalisTransactions";

export function ClientAccount({ onLogout }: { onLogout: () => void }) {
  const [client, setClient] = useState<LocalClient | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { cancelAppointment, txInProgress } = useVitalisTransactions();

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientData = getClientData();
        if (clientData) {
          setClient(clientData);
          const resvs = getReservations();
          setReservations(resvs);
        }
      } catch (err) {
        console.error("Failed to load account data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const reservation = reservations.find((r) => r.id === reservationId);
      setCancellingId(reservationId);

      if (reservation?.appointmentId && client?.id) {
        await cancelAppointment(client.id, reservation.appointmentId);
      }

      cancelReservation(reservationId);
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: "cancelled" } : r))
      );
      setShowCancelDialog(false);
    } catch (err) {
      console.error("Failed to cancel reservation:", err);
    }
    setCancellingId(null);
  };

  const getBusinessName = (businessId: string) => {
    return businesses.find((b) => b.id === businessId)?.name || "Unknown";
  };

  const getServiceName = (businessId: string, serviceId: string) => {
    const business = businesses.find((b) => b.id === businessId);
    return business?.services.find((s) => s.id === serviceId)?.name || "Unknown";
  };

  if (loading) {
    return (
      <Box style={{ textAlign: "center", padding: "2rem" }}>
        <Text>Loading profile...</Text>
      </Box>
    );
  }

  if (!client) {
    return (
      <Box style={{ textAlign: "center", padding: "2rem" }}>
        <Text color="red">Profile not found</Text>
      </Box>
    );
  }

  return (
    <Flex direction="column" gap="6">
      {/* Profile Card */}
      <Card style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Flex direction="column" gap="4" p="4">
          <Flex justify="between" align="start">
            <Flex direction="column" gap="2">
              <Heading size="6">👤 My Profile</Heading>
              <Flex direction="column" gap="1">
                <Flex gap="2" align="center">
                  <Text weight="bold" size="2">
                    Name:
                  </Text>
                  <Text size="2">{client.display_name}</Text>
                </Flex>
                <Flex gap="2" align="center">
                  <Text weight="bold" size="2">
                    Email:
                  </Text>
                  <Text size="2">{client.email}</Text>
                </Flex>
                <Flex gap="2" align="center">
                  <Text weight="bold" size="2">
                    Wallet:
                  </Text>
                  <Text
                    size="2"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      background: "#F8F8F8",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                    }}
                  >
                    {client.wallet.slice(0, 6)}...{client.wallet.slice(-6)}
                  </Text>
                </Flex>
                <Flex gap="2" align="center">
                  <Text weight="bold" size="2">
                    Member Since:
                  </Text>
                  <Text size="2">
                    {new Date(client.created_at).toLocaleDateString()}
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="soft"
              color="red"
              size="3"
            >
              Logout
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Reservations */}
      <Flex direction="column" gap="3">
        <Heading size="6">📅 My Bookings ({reservations.length})</Heading>

        {reservations.length === 0 ? (
          <Card style={{ background: "#F8F8F8", boxShadow: "none", padding: "2rem" }}>
            <Text size="2" color="gray" align="center">
              No bookings yet. Visit the Businesses page to make your first reservation!
            </Text>
          </Card>
        ) : (
          <Flex direction="column" gap="3">
            {reservations.map((reservation) => (
              <Card
                key={reservation.id}
                style={{
                  background: "white",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <Flex direction="column" gap="3" p="4">
                  <Flex justify="between" align="start">
                    <Flex direction="column" gap="2" style={{ flex: 1 }}>
                      <Heading size="5">
                        {getBusinessName(reservation.businessId)}
                      </Heading>
                      <Flex direction="column" gap="1">
                        <Text size="2" color="gray">
                          Service: {getServiceName(reservation.businessId, reservation.serviceId)}
                        </Text>
                        {reservation.providerName && (
                          <Text size="2" color="gray">
                            Provider: {reservation.providerName}
                          </Text>
                        )}
                        <Flex gap="2" align="center">
                          <Text size="2" color="gray">
                            📅 {reservation.date} at {reservation.timeSlot}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>

                    <Badge
                      style={{
                        background:
                          reservation.status === "confirmed"
                            ? "#D1E7DD"
                            : reservation.status === "completed"
                              ? "#D4EDDA"
                              : "#F8D7DA",
                        color:
                          reservation.status === "confirmed"
                            ? "#0C5460"
                            : reservation.status === "completed"
                              ? "#155724"
                              : "#721C24",
                      }}
                    >
                      {reservation.status.charAt(0).toUpperCase() +
                        reservation.status.slice(1)}
                    </Badge>
                  </Flex>

                  {reservation.status === "confirmed" && (
                    <Button
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowCancelDialog(true);
                      }}
                      variant="soft"
                      color="red"
                      size="2"
                      style={{ alignSelf: "flex-start" }}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </Flex>
              </Card>
            ))}
          </Flex>
        )}
      </Flex>

      {/* Cancel Dialog */}
      <Dialog.Root open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <Dialog.Content>
          <Dialog.Title>Cancel Booking?</Dialog.Title>
          <Text size="2" color="gray">
            Are you sure you want to cancel the booking for{" "}
            <strong>{getBusinessName(selectedReservation?.businessId || "")}</strong> on{" "}
            <strong>{selectedReservation?.date}</strong> at{" "}
            <strong>{selectedReservation?.timeSlot}</strong>?
          </Text>

          <Flex gap="2" justify="end" style={{ marginTop: "1.5rem" }}>
            <Dialog.Close>
              <Button variant="soft">Keep Booking</Button>
            </Dialog.Close>
            <Button
              onClick={() => {
                if (selectedReservation?.id) {
                  handleCancelReservation(selectedReservation.id);
                }
              }}
              color="red"
              disabled={txInProgress || cancellingId === selectedReservation?.id}
              style={{ background: "#DC3545", color: "white" }}
            >
              {txInProgress || cancellingId === selectedReservation?.id ? "Cancelling..." : "Cancel Booking"}
            </Button>
          </Flex>

        </Dialog.Content>
      </Dialog.Root>

      {/* Logout Dialog */}
      <Dialog.Root open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>⚠️ Disconnect Wallet First</Dialog.Title>
          <Flex direction="column" gap="4" style={{ marginTop: "1rem" }}>
            <Text size="2">
              Please disconnect your wallet before logging out to avoid connection issues.
            </Text>
            
            <Box
              style={{
                background: "#F8F9FA",
                border: "2px solid #7B3FF2",
                borderRadius: "12px",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <Text size="2" weight="bold" style={{ display: "block", marginBottom: "1rem" }}>
                Step 1: Disconnect your wallet here
              </Text>
              <Box style={{ display: "flex", justifyContent: "center" }}>
                <ConnectButton />
              </Box>
            </Box>

            <Box
              style={{
                background: "#FFF3CD",
                border: "1px solid #FFE69C",
                borderRadius: "8px",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <Text size="2" weight="bold" style={{ display: "block", marginBottom: "0.5rem" }}>
                Step 2: Click Log Out below
              </Text>
              <Text size="2">
                After disconnecting your wallet, press the Log Out button.
              </Text>
            </Box>
          </Flex>

          <Flex gap="2" justify="end" style={{ marginTop: "1.5rem" }}>
            <Dialog.Close>
              <Button variant="soft">Cancel</Button>
            </Dialog.Close>
            <Button
              onClick={() => {
                setShowLogoutDialog(false);
                onLogout();
              }}
              color="red"
              style={{ background: "#DC3545", color: "white" }}
            >
              Log Out
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}
