import { useState } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  Badge,
  Dialog,
  TextField,
} from "@radix-ui/themes";
import { businesses, type Business } from "../businesses";
import { getClientData, saveReservation, saveClientData } from "../clientStorage";
import { useVitalisTransactions } from "../useVitalisTransactions";
import { VITALIS_PACKAGE_ID } from "../config";

interface BookingState {
  businessId: string | null;
  serviceId: string | null;
  providerId: string | null;
  date: string;
  time: string;
}

export function BusinessesPage() {
  const { createReservation, txInProgress } = useVitalisTransactions();
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const client = getClientData();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [booking, setBooking] = useState<BookingState>({
    businessId: null,
    serviceId: null,
    providerId: null,
    date: "",
    time: "",
  });
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"service" | "provider" | "date" | "time" | "confirm">("service");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleStartBooking = (business: Business) => {
    setSelectedBusiness(business);
    setBooking({ businessId: business.id, serviceId: null, providerId: null, date: "", time: "" });
    setBookingStep("service");
    setIsBookingOpen(true);
    setError(null);
  };

  const handleSelectService = (serviceId: string) => {
    setBooking({ ...booking, serviceId });
    setBookingStep("provider");
    setError(null);
  };

  const handleSelectProvider = (providerId?: string) => {
    setBooking({ ...booking, providerId: providerId || null });
    setBookingStep("date");
    setError(null);
  };

  const handleSelectDate = () => {
    if (!booking.date) {
      setError("Please select a date");
      return;
    }
    setBookingStep("time");
    setError(null);
  };

  const handleSelectTime = () => {
    if (!booking.time) {
      setError("Please select a time");
      return;
    }
    setBookingStep("confirm");
    setError(null);
  };

  const handleConfirmBooking = async () => {
    try {
      if (!booking.businessId || !booking.serviceId || !booking.date || !booking.time) {
        setError("Missing booking details");
        return;
      }

      const business = businesses.find((b) => b.id === booking.businessId);
      const service = business?.services.find((s) => s.id === booking.serviceId);
      if (!business || !service) {
        setError("Unable to locate the selected business or service");
        return;
      }

      if (!account?.address) {
        setError("Connect your wallet to book an appointment");
        return;
      }

      // Resolve the current ClientNFT ID from chain (handles new package deployments)
      const resolvedClientId = await (async () => {
        const res = await suiClient.getOwnedObjects({
          owner: account.address,
          filter: { StructType: `${VITALIS_PACKAGE_ID}::vitalis_identity::ClientNFT` },
          options: { showType: true },
          limit: 1,
        });
        const objId = res.data[0]?.data?.objectId;
        if (objId && client?.id !== objId) {
          saveClientData({ ...(client || { wallet: account.address, display_name: "User", email: "", created_at: Date.now() } as any), id: objId });
        }
        return objId;
      })();

      if (!resolvedClientId) {
        setError("No Client NFT found on this wallet. Please register again.");
        return;
      }

      const chosenProvider = booking.providerId
        ? business.providers.find((p) => p.id === booking.providerId)
        : business.providers.find((p) => p.onChainId) || business.providers[0];

      setError(null);

      const { appointmentId } = await createReservation({
        clientId: resolvedClientId,
        timeSlot: booking.time,
        date: booking.date,
        durationMinutes: service.duration,
        providerName: chosenProvider?.name || "Any available provider",
      });

      const reservation = {
        id: appointmentId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        appointmentId: appointmentId || undefined,
        businessId: booking.businessId,
        serviceId: booking.serviceId,
        providerId: booking.providerId || chosenProvider?.id || undefined,
        providerName: chosenProvider?.name || "Any available provider",
        date: booking.date,
        timeSlot: booking.time,
        status: "confirmed" as const,
        createdAt: Date.now(),
      };

      await saveReservation(reservation);

      setSuccess(`Booking confirmed for ${business.name}!`);
      setIsBookingOpen(false);
      setBooking({ businessId: null, serviceId: null, providerId: null, date: "", time: "" });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save booking");
    }
  };

  const currentBusiness = booking.businessId
    ? businesses.find((b) => b.id === booking.businessId)
    : null;
  const currentService = currentBusiness?.services.find((s) => s.id === booking.serviceId);

  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  if (!client) {
    return (
      <Box style={{ padding: "2rem", textAlign: "center" }}>
        <Heading size="6">Connect your wallet to book</Heading>
        <Text color="gray">Please connect your wallet to create an on-chain reservation.</Text>
      </Box>
    );
  }

  return (
    <Box>
      {success && (
        <Box
          style={{
            padding: "1rem",
            background: "#D4EDDA",
            color: "#155724",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          <Text size="2" weight="bold">
            {success}
          </Text>
        </Box>
      )}

      <Heading size="7" style={{ marginBottom: "2rem" }}>
        ✨ Beauty & Wellness Businesses
      </Heading>

      <Flex
        gap="4"
        wrap="wrap"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "24px",
        }}
      >
        {businesses.map((business) => (
          <Card
            key={business.id}
            style={{
              background: "white",
              boxShadow: "0 2px 12px rgba(176, 70, 162, 0.12)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "2px solid var(--accent-primary)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 20px rgba(176,70,162,0.25)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 12px rgba(176, 70, 162, 0.12)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <Flex direction="column" gap="3" p="4" style={{ flex: 1 }}>
              <Flex justify="between" align="start">
                <Flex direction="column" gap="2" style={{ flex: 1 }}>
                  <Heading size="5" style={{ color: "var(--accent-primary)" }}>{business.name}</Heading>
                  <Text size="2" style={{ color: "#1a1a1a" }}>
                    {business.location}
                  </Text>
                  <Flex gap="2" align="center">
                    <Badge
                      style={{
                        background: "var(--accent-secondary)",
                        color: "white",
                      }}
                    >
                      ⭐ {business.rating} ({business.reviewCount} reviews)
                    </Badge>
                  </Flex>
                </Flex>
              </Flex>

              <Flex direction="column" gap="2">
                <Text weight="bold" size="2" style={{ color: "#1a1a1a" }}>
                  Services ({business.services.length}):
                </Text>
                <Flex direction="column" gap="1">
                  {business.services.slice(0, 3).map((service) => (
                    <Text key={service.id} size="2" style={{ color: "#666" }}>
                      • {service.name} - {service.price} RON
                    </Text>
                  ))}
                  {business.services.length > 3 && (
                    <Text size="2" style={{ fontStyle: "italic", color: "#666" }}>
                      + {business.services.length - 3} more...
                    </Text>
                  )}
                </Flex>
              </Flex>

              <Flex direction="column" gap="2">
                <Text weight="bold" size="2" style={{ color: "#1a1a1a" }}>
                  Available Providers: {business.providers.length}
                </Text>
              </Flex>

              <Button
                onClick={() => handleStartBooking(business)}
                size="3"
                style={{
                  background: "var(--accent-gradient)",
                  color: "white",
                  marginTop: "auto",
                  transition: "var(--transition)",
                  border: "none",
                  boxShadow: "var(--box-shadow-sm)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--box-shadow-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--box-shadow-sm)";
                }}
              >
                Book Now
              </Button>
            </Flex>
          </Card>
        ))}
      </Flex>

      {/* Booking Dialog */}
      <Dialog.Root open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <Dialog.Content maxWidth="500px" style={{ maxHeight: "80vh", overflow: "auto" }}>
          <Dialog.Title>
            {selectedBusiness?.name} - {["Service", "Provider", "Date", "Time", "Confirm"][["service", "provider", "date", "time", "confirm"].indexOf(bookingStep)]}
          </Dialog.Title>

          <Flex direction="column" gap="4">
            {/* Step 1: Service Selection */}
            {bookingStep === "service" && currentBusiness && (
              <Flex direction="column" gap="3">
                <Text size="2" color="gray">
                  Choose a service
                </Text>
                <Flex direction="column" gap="2">
                  {currentBusiness.services.map((service) => (
                    <Box
                      key={service.id}
                      onClick={() => handleSelectService(service.id)}
                      style={{
                        padding: "1rem",
                        borderRadius: "8px",
                        border:
                          booking.serviceId === service.id
                            ? "2px solid var(--accent-primary)"
                            : "1px solid var(--border-color)",
                        background:
                          booking.serviceId === service.id ? "var(--accent-very-light)" : "var(--secondary-bg)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Flex justify="between" align="start">
                        <Flex direction="column" gap="1">
                          <Text weight="bold" size="2">
                            {service.name}
                          </Text>
                          <Text size="2" color="gray">
                            {service.description}
                          </Text>
                          <Text size="1" color="gray">
                            {service.duration} min
                          </Text>
                        </Flex>
                        <Text weight="bold" style={{ color: "var(--accent-secondary)" }}>
                          {service.price} RON
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                </Flex>
              </Flex>
            )}

            {/* Step 2: Provider Selection (Optional) */}
            {bookingStep === "provider" && currentBusiness && (
              <Flex direction="column" gap="3">
                <Text size="2" style={{ color: "#666" }}>
                  Choose a provider (optional)
                </Text>
                <Flex direction="column" gap="2">
                  <Box
                    onClick={() => handleSelectProvider()}
                    style={{
                      padding: "1rem",
                      borderRadius: "8px",
                      border:
                        booking.providerId === null
                          ? "2px solid var(--accent-primary)"
                          : "1px solid var(--border-color)",
                      background: booking.providerId === null ? "var(--accent-very-light)" : "var(--secondary-bg)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Text weight="bold" size="2">
                      No preference (any available)
                    </Text>
                  </Box>
                  {currentBusiness.providers.map((provider) => (
                    <Box
                      key={provider.id}
                      onClick={() => handleSelectProvider(provider.id)}
                      style={{
                        padding: "1rem",
                        borderRadius: "8px",
                        border:
                          booking.providerId === provider.id
                            ? "2px solid var(--accent-primary)"
                            : "1px solid var(--border-color)",
                        background:
                          booking.providerId === provider.id ? "var(--accent-very-light)" : "var(--secondary-bg)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Flex justify="between" align="start">
                        <Flex direction="column" gap="1">
                          <Text weight="bold" size="2">
                            {provider.name}
                          </Text>
                          <Text size="2" style={{ color: "#666" }}>
                            {provider.specialty}
                          </Text>
                          <Badge
                            style={{
                              background: "var(--accent-secondary)",
                              color: "white",
                              width: "fit-content",
                            }}
                          >
                            ⭐ {provider.rating}
                          </Badge>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </Flex>
              </Flex>
            )}

            {/* Step 3: Date Selection */}
            {bookingStep === "date" && currentService && (
              <Flex direction="column" gap="3">
                <Text size="2" color="gray">
                  Choose a date for {currentService.name}
                </Text>
                <TextField.Root
                  type="date"
                  value={booking.date}
                  onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                  size="3"
                />
              </Flex>
            )}

            {/* Step 3: Time Selection */}
            {bookingStep === "time" && (
              <Flex direction="column" gap="3">
                <Text size="2" color="gray">
                  Choose a time slot
                </Text>
                <Flex direction="column" gap="2" style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {timeSlots.map((slot) => (
                    <Box
                      key={slot}
                      onClick={() => setBooking({ ...booking, time: slot })}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border:
                          booking.time === slot
                            ? "2px solid var(--accent-primary)"
                            : "1px solid var(--border-color)",
                        background: booking.time === slot ? "var(--accent-very-light)" : "var(--secondary-bg)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Text size="2" weight={booking.time === slot ? "bold" : "regular"}>
                        {slot}
                      </Text>
                    </Box>
                  ))}
                </Flex>
              </Flex>
            )}

            {/* Step 4: Confirmation */}
            {bookingStep === "confirm" && currentBusiness && currentService && (
              <Flex direction="column" gap="3">
                <Box
                  style={{
                    background: "#F8F8F8",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <Flex direction="column" gap="2">
                    <Flex justify="between">
                      <Text weight="bold" size="2">
                        Business:
                      </Text>
                      <Text size="2">{currentBusiness.name}</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text weight="bold" size="2">
                        Service:
                      </Text>
                      <Text size="2">{currentService.name}</Text>
                    </Flex>
                    {booking.providerId && (
                      <Flex justify="between">
                        <Text weight="bold" size="2">
                          Provider:
                        </Text>
                        <Text size="2">
                          {currentBusiness.providers.find(p => p.id === booking.providerId)?.name || "Any available"}
                        </Text>
                      </Flex>
                    )}
                    <Flex justify="between">
                      <Text weight="bold" size="2">
                        Date:
                      </Text>
                      <Text size="2">{booking.date}</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text weight="bold" size="2">
                        Time:
                      </Text>
                      <Text size="2">{booking.time}</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text weight="bold" size="2">
                        Price:
                      </Text>
                      <Text weight="bold" style={{ color: "var(--accent-secondary)" }}>
                        {currentService.price} RON
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            )}

            {error && (
              <Text color="red" size="2">
                {error}
              </Text>
            )}

            <Flex gap="2" justify="end">
              {bookingStep !== "service" && (
                <Button
                  onClick={() => {
                    const steps: ("service" | "provider" | "date" | "time" | "confirm")[] = [
                      "service",
                      "provider",
                      "date",
                      "time",
                      "confirm",
                    ];
                    const currentIndex = steps.indexOf(bookingStep);
                    if (currentIndex > 0) {
                      setBookingStep(steps[currentIndex - 1]);
                      setError(null);
                    }
                  }}
                  variant="soft"
                >
                  Back
                </Button>
              )}

              {bookingStep === "service" && (
                <Button
                  onClick={() => {
                    if (!booking.serviceId) {
                      setError("Please select a service");
                      return;
                    }
                    setBookingStep("provider");
                  }}
                  style={{ background: "var(--accent-gradient)", color: "white", border: "none" }}
                >
                  Next
                </Button>
              )}

              {bookingStep === "provider" && (
                <Button
                  onClick={() => {
                    setBookingStep("date");
                  }}
                  style={{ background: "var(--accent-gradient)", color: "white", border: "none" }}
                >
                  Next
                </Button>
              )}

              {bookingStep === "date" && (
                <Button
                  onClick={handleSelectDate}
                  style={{ background: "var(--accent-gradient)", color: "white", border: "none" }}
                >
                  Next
                </Button>
              )}

              {bookingStep === "time" && (
                <Button
                  onClick={handleSelectTime}
                  style={{ background: "var(--accent-gradient)", color: "white", border: "none" }}
                >
                  Next
                </Button>
              )}

              {bookingStep === "confirm" && (
                <Button
                  onClick={handleConfirmBooking}
                  disabled={txInProgress}
                  style={{ background: "var(--accent-gradient)", color: "white", border: "none" }}
                >
                  {txInProgress ? "Confirming..." : "Confirm Booking"}
                </Button>
              )}
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
