import { useEffect, useState, useMemo } from "react";
import { Box, Button, Card, Flex, Heading, Text, Badge, Spinner, Table } from "@radix-ui/themes";
import { ProviderNFT } from "../types";
import { useSuiClient } from "@mysten/dapp-kit";
import { VITALIS_MODULES, APPOINTMENT_STATUS, STATUS_LABELS } from "../config";
import { cardStyle, cardHoverStyle, accentColor, accentLight } from "../sharedStyles";

interface ProviderDashboardProps {
  provider: ProviderNFT;
}

interface AppointmentData {
  id: string;
  client_id: string;
  client_name?: string;
  start_time: number;
  end_time: number;
  status: number;
  created_at: number;
}

export function ProviderDashboard({ provider }: ProviderDashboardProps) {
  const client = useSuiClient();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientNames, setClientNames] = useState<Record<string, string>>({});

  // Query appointments by provider
  useEffect(() => {
    const queryAppointments = async () => {
      try {
        setLoading(true);
        
        // Query all appointment objects
        const response = await client.queryEvents({
          query: {
            MoveModule: {
              package: VITALIS_MODULES.appointments.split("::")[0],
              module: "vitalis_appointments",
            },
          },
          limit: 100,
        });

        console.log("Events response:", response);

        // Since events won't directly give us appointments, we'll use queryObjects instead
        // Query for Appointment objects that match this provider
        const objectsResponse = await client.getOwnedObjects({
          owner: provider.company_id,
          filter: {
            MatchAll: [
              {
                StructType: `${VITALIS_MODULES.appointments}::Appointment`,
              },
            ],
          },
          options: {
            showContent: true,
            showType: true,
          },
        });

        console.log("Appointments query response:", objectsResponse);

        // Parse appointments where provider_id matches
        const foundAppointments: AppointmentData[] = [];
        for (const obj of objectsResponse.data) {
          const fields: any = obj.data?.content?.fields || {};
          if (fields.provider_id === provider.id) {
            foundAppointments.push({
              id: obj.data?.objectId || "",
              client_id: fields.client_id || "",
              start_time: parseInt(fields.start_time) || 0,
              end_time: parseInt(fields.end_time) || 0,
              status: parseInt(fields.status) || 0,
              created_at: parseInt(fields.created_at) || 0,
            });
          }
        }

        setAppointments(foundAppointments);

        // Fetch client names
        const names: Record<string, string> = {};
        for (const appt of foundAppointments) {
          if (!names[appt.client_id]) {
            try {
              const clientObj = await client.getObject({
                id: appt.client_id,
                options: {
                  showContent: true,
                },
              });
              const clientFields: any = clientObj.data?.content?.fields || {};
              names[appt.client_id] = clientFields.display_name || "Unknown Client";
            } catch (err) {
              names[appt.client_id] = "Unknown Client";
            }
          }
        }
        setClientNames(names);
      } catch (err) {
        console.error("Failed to query appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    queryAppointments();
  }, [client, provider.id, provider.company_id]);

  // Get unique patients
  const patients = useMemo(() => {
    const seen = new Set<string>();
    return appointments
      .filter((appt) => {
        if (seen.has(appt.client_id)) return false;
        seen.add(appt.client_id);
        return true;
      })
      .map((appt) => ({
        id: appt.client_id,
        name: clientNames[appt.client_id] || "Loading...",
        appointments: appointments.filter((a) => a.client_id === appt.client_id).length,
      }));
  }, [appointments, clientNames]);

  // Get upcoming appointments (booked, start_time in future)
  const upcomingAppointments = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    return appointments
      .filter(
        (appt) =>
          appt.status === APPOINTMENT_STATUS.BOOKED && appt.start_time > now
      )
      .sort((a, b) => a.start_time - b.start_time);
  }, [appointments]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getDurationMinutes = (start: number, end: number) => {
    return Math.round((end - start) / 60);
  };

  return (
    <Box style={{ width: "100%", minHeight: "100vh", background: "linear-gradient(135deg, #b046a2 0%, #fa9ccd 100%)", padding: "32px 0" }}>
      <Flex direction="column" gap="6" style={{ width: "100%", padding: "0 32px" }}>
      
      {/* Header Section */}
      <Flex justify="between" align="center" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <Box>
          <Heading size="8" style={{ background: "linear-gradient(135deg, #b046a2 0%, #fa9ccd 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
            👨‍⚕️ {provider.name}
          </Heading>
          <Flex gap="4" align="center">
            <Text size="2" color="gray">
              <strong>Role:</strong> {provider.role}
            </Text>
            <Text size="2" color="gray">
              <strong>Status:</strong> <span style={{ color: provider.active ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                {provider.active ? "● Active" : "● Inactive"}
              </span>
            </Text>
            <Text size="2" color="gray">
              <strong>Joined:</strong> {new Date(provider.created_at * 1000).toLocaleDateString()}
            </Text>
          </Flex>
        </Box>
        <Box style={{ background: "linear-gradient(135deg, #b046a2 0%, #fa9ccd 100%)", borderRadius: "16px", padding: "20px 40px", boxShadow: "0 10px 30px rgba(176,70,162,0.3)" }}>
          <Text size="1" style={{ color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "2px", fontSize: "11px", marginBottom: "8px", display: "block" }}>
            Provider ID
          </Text>
          <Text size="3" weight="bold" style={{ color: "#fff", fontFamily: "monospace" }}>
            {provider.id.substring(0, 8)}...{provider.id.slice(-6)}
          </Text>
        </Box>
      </Flex>

      {/* Stats Row */}
      <Flex gap="4" wrap="wrap">
        <Card style={{ flex: 1, minWidth: "200px", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "none", padding: "24px" }}>
          <Flex direction="column" gap="2" align="center">
            <Text size="1" color="gray" weight="medium">👥 Total Patients</Text>
            <Heading size="6" style={{ color: "#b046a2" }}>{patients.length}</Heading>
          </Flex>
        </Card>
        <Card style={{ flex: 1, minWidth: "200px", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "none", padding: "24px" }}>
          <Flex direction="column" gap="2" align="center">
            <Text size="1" color="gray" weight="medium">📅 Upcoming</Text>
            <Heading size="6" style={{ color: "#fa9ccd" }}>{upcomingAppointments.length}</Heading>
          </Flex>
        </Card>
        <Card style={{ flex: 1, minWidth: "200px", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "none", padding: "24px" }}>
          <Flex direction="column" gap="2" align="center">
            <Text size="1" color="gray" weight="medium">📊 Total Appointments</Text>
            <Heading size="6">{appointments.length}</Heading>
          </Flex>
        </Card>
      </Flex>

      {/* Upcoming Appointments */}
      <Card style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "none", padding: "28px" }}>
        <Flex direction="column" gap="4">
          <Flex align="center" gap="3">
            <Box style={{ width: "8px", height: "40px", background: "linear-gradient(180deg, #b046a2 0%, #fa9ccd 100%)", borderRadius: "4px" }}></Box>
            <Heading size="6">Upcoming Appointments</Heading>
          </Flex>
          
          {loading ? (
            <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
              <Spinner />
            </Flex>
          ) : upcomingAppointments.length === 0 ? (
            <Text color="gray" size="2">No upcoming appointments</Text>
          ) : (
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Patient</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Start Time</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Duration</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {upcomingAppointments.map((appt) => (
                  <Table.Row key={appt.id}>
                    <Table.Cell>
                      <Text size="2">{clientNames[appt.client_id] || "Loading..."}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{formatTime(appt.start_time)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{getDurationMinutes(appt.start_time, appt.end_time)} min</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Button size="1" variant="soft">
                        Mark Complete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Flex>
      </Card>

      {/* Patients List */}
      <Card style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "none", padding: "28px" }}>
        <Flex direction="column" gap="4">
          <Flex align="center" gap="3">
            <Box style={{ width: "8px", height: "40px", background: "linear-gradient(180deg, #b046a2 0%, #fa9ccd 100%)", borderRadius: "4px" }}></Box>
            <Heading size="6">Your Patients ({patients.length})</Heading>
          </Flex>
          
          {loading ? (
            <Flex justify="center" align="center" style={{ minHeight: "150px" }}>
              <Spinner />
            </Flex>
          ) : patients.length === 0 ? (
            <Text color="gray" size="2">No patients yet</Text>
          ) : (
            <Flex direction="column" gap="2">
              {patients.map((patient) => (
                <Card key={patient.id} style={{ backgroundColor: "var(--gray-2)" }}>
                  <Flex justify="between" align="center">
                    <Box>
                      <Text size="2" weight="medium">{patient.name}</Text>
                      <Text size="1" color="gray">{patient.appointments} appointment{patient.appointments !== 1 ? 's' : ''}</Text>
                    </Box>
                    <Button size="1" variant="soft">
                      View History
                    </Button>
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}
        </Flex>
      </Card>
    </Flex>
    </Box>
  );
}
