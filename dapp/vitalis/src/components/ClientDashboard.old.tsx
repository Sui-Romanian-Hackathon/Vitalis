import { Box, Card, Flex, Heading, Text, Spinner, Button } from "@radix-ui/themes";
import { ClientNFT } from "../types";
import { useVitalisTransactions } from "../useVitalisTransactions";
import { useEffect, useState } from "react";

interface ClientDashboardProps {
  client: ClientNFT;
}

interface Company {
  id: string;
  name: string;
  providers: Array<{ id: string; name: string; role: string; wallet: string }>;
}

export function ClientDashboard({ client }: ClientDashboardProps) {
  const { getAllCompaniesWithProviders } = useVitalisTransactions();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllCompaniesWithProviders();
        console.log("Loaded companies:", data);
        setCompanies(data);
      } catch (err: any) {
        console.error("Error loading companies:", err);
        setError(err?.message || "Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const nextAppointment = {
    provider: "Dr. Sarah Johnson",
    service: "Facial Treatment",
    date: "2025-01-20",
    time: "2:00 PM",
    location: "Beauty Clinic Downtown",
  };

  const recentNotifications = [
    { icon: "📅", text: "Your appointment with Dr. Sarah is in 2 days", time: "2 hours ago" },
    { icon: "💬", text: "Dr. Johnson sent you a message", time: "4 hours ago" },
    { icon: "✅", text: "Appointment confirmed for January 20th", time: "1 day ago" },
  ];

  return (
    <Box style={{ minHeight: "100vh", background: "var(--primary-bg)", padding: "2rem 0" }}>
      <Box style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 clamp(1rem, 5vw, 2rem)" }}>
        <Flex direction="column" gap="2rem">
          {/* DASHBOARD ROW 1: Welcome Header + Next Appointment */}
          <Flex gap="2rem" wrap="wrap" justify="between" align="start">
            {/* Welcome Card */}
            <Card
              style={{
                flex: "1 1 280px",
                padding: "2rem",
                background: "var(--secondary-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--border-radius-lg)",
                boxShadow: "var(--box-shadow-md)",
              }}
            >
              <Flex direction="column" gap="1rem">
                <Heading
                  size="6"
                  style={{
                    fontSize: "1.75rem",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    background: "var(--accent-gradient)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Welcome, {client.display_name}!
                </Heading>
                <Text size="3" style={{ color: "var(--text-light)" }}>
                  Member since {new Date(client.created_at * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </Text>
                <Box
                  style={{
                    padding: "1rem",
                    borderRadius: "var(--border-radius-md)",
                    background: "var(--accent-light)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <Text size="2" style={{ color: "var(--text-lighter)", display: "block", marginBottom: "0.5rem" }}>
                    Your ID
                  </Text>
                  <Text
                    size="3"
                    style={{
                      color: "var(--accent-primary)",
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  >
                    {client.id.substring(0, 8)}...{client.id.slice(-6)}
                  </Text>
                </Box>
              </Flex>
            </Card>

            {/* Next Appointment Card - Large */}
            <Card
              style={{
                flex: "1 1 300px",
                padding: "2rem",
                background: "var(--accent-gradient-soft)",
                border: "2px solid var(--accent-primary)",
                borderRadius: "var(--border-radius-lg)",
                boxShadow: "var(--box-shadow-lg)",
              }}
            >
              <Flex direction="column" gap="1.5rem">
                <Flex direction="column" gap="0.5rem">
                  <Heading
                    size="4"
                    style={{
                      color: "var(--accent-primary)",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                    }}
                  >
                    📅 Next Appointment
                  </Heading>
                  <Text size="3" style={{ color: "var(--text-light)" }}>
                    Upcoming beauty treatment
                  </Text>
                </Flex>

                <Box
                  style={{
                    padding: "1.5rem",
                    background: "var(--secondary-bg)",
                    borderRadius: "var(--border-radius-md)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <Text size="4" style={{ color: "var(--text-color)", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
                    {nextAppointment.service}
                  </Text>
                  <Text size="3" style={{ color: "var(--text-light)", display: "block", marginBottom: "1rem" }}>
                    with {nextAppointment.provider}
                  </Text>

                  <Flex direction="column" gap="0.75rem" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                    <Flex align="center" gap="1rem">
                      <span style={{ fontSize: "1.2rem" }}>📆</span>
                      <Text size="3" style={{ color: "var(--text-color)" }}>
                        {new Date(nextAppointment.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                      </Text>
                    </Flex>
                    <Flex align="center" gap="1rem">
                      <span style={{ fontSize: "1.2rem" }}>⏰</span>
                      <Text size="3" style={{ color: "var(--text-color)" }}>
                        {nextAppointment.time}
                      </Text>
                    </Flex>
                    <Flex align="center" gap="1rem">
                      <span style={{ fontSize: "1.2rem" }}>📍</span>
                      <Text size="3" style={{ color: "var(--text-color)" }}>
                        {nextAppointment.location}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>

                <Flex gap="1rem">
                  <Button
                    style={{
                      flex: 1,
                      background: "var(--accent-gradient)",
                      color: "white",
                      cursor: "pointer",
                      padding: "var(--button-padding-md)",
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    style={{
                      flex: 1,
                      background: "var(--secondary-bg)",
                      color: "var(--accent-primary)",
                      border: "1.5px solid var(--accent-primary)",
                      cursor: "pointer",
                      padding: "var(--button-padding-md)",
                    }}
                  >
                    Reschedule
                  </Button>
                </Flex>
              </Flex>
            </Card>
          </Flex>

          {/* DASHBOARD ROW 2: Action Blocks */}
          <Flex gap="1.5rem" wrap="wrap" justify="center">
            {[
              {
                icon: "📅",
                title: "Schedule Appointment",
                desc: "Book a new treatment session",
                color: "var(--accent-primary)",
              },
              {
                icon: "📋",
                title: "Manage Appointments",
                desc: "View and edit your bookings",
                color: "var(--accent-secondary)",
              },
              {
                icon: "📊",
                title: "Appointments Record",
                desc: "View your full history",
                color: "var(--accent-primary)",
              },
            ].map((action) => (
              <Card
                key={action.title}
                style={{
                  flex: "1 1 200px",
                  minHeight: "180px",
                  padding: "1.5rem",
                  background: "var(--secondary-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--border-radius-lg)",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-lg)";
                  e.currentTarget.style.borderColor = action.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-md)";
                  e.currentTarget.style.borderColor = "var(--border-color)";
                }}
              >
                <Flex direction="column" gap="1rem" style={{ height: "100%" }}>
                  <Text style={{ fontSize: "2.5rem" }}>{action.icon}</Text>
                  <Flex direction="column" gap="0.5rem" style={{ flex: 1 }}>
                    <Heading
                      size="4"
                      style={{
                        color: action.color,
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        fontSize: "1rem",
                      }}
                    >
                      {action.title}
                    </Heading>
                    <Text size="3" style={{ color: "var(--text-light)" }}>
                      {action.desc}
                    </Text>
                  </Flex>
                  <Text
                    size="3"
                    style={{
                      color: action.color,
                      fontWeight: 600,
                      transition: "var(--transition)",
                    }}
                  >
                    → Explore
                  </Text>
                </Flex>
              </Card>
            ))}
          </Flex>

          {/* DASHBOARD ROW 3: Notifications */}
          <Card
            style={{
              padding: "2rem",
              background: "var(--secondary-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--border-radius-lg)",
              boxShadow: "var(--box-shadow-md)",
            }}
          >
            <Flex direction="column" gap="1.5rem">
              <Heading
                size="5"
                style={{
                  color: "var(--text-color)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                }}
              >
                🔔 Recent Notifications
              </Heading>

              <Flex direction="column" gap="1rem">
                {recentNotifications.map((notif, idx) => (
                  <Box
                    key={idx}
                    style={{
                      padding: "1rem",
                      borderRadius: "var(--border-radius-md)",
                      background: "var(--primary-bg)",
                      border: "1px solid var(--border-color)",
                      transition: "var(--transition)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--accent-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--primary-bg)";
                    }}
                  >
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="1rem" style={{ flex: 1 }}>
                        <span style={{ fontSize: "1.5rem" }}>{notif.icon}</span>
                        <Flex direction="column" gap="0.25rem">
                          <Text size="3" style={{ color: "var(--text-color)", fontWeight: 500 }}>
                            {notif.text}
                          </Text>
                          <Text size="2" style={{ color: "var(--text-lighter)" }}>
                            {notif.time}
                          </Text>
                        </Flex>
                      </Flex>
                      <Button
                        size="1"
                        style={{
                          background: "transparent",
                          color: "var(--text-lighter)",
                          border: "none",
                          cursor: "pointer",
                          padding: "0.25rem",
                        }}
                      >
                        ✕
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </Flex>
          </Card>

          {/* Browse Services Section */}
          <Card
            style={{
              padding: "2rem",
              background: "var(--secondary-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--border-radius-lg)",
              boxShadow: "var(--box-shadow-md)",
            }}
          >
            <Flex direction="column" gap="1.5rem">
              <Flex align="center" justify="between">
                <Heading
                  size="5"
                  style={{
                    color: "var(--text-color)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                  }}
                >
                  🏥 Browse Services
                </Heading>
                <Box
                  style={{
                    background: "var(--accent-gradient)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "999px",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                  }}
                >
                  {companies.length} companies
                </Box>
              </Flex>

              {loading ? (
                <Flex justify="center" align="center" style={{ padding: "3rem 2rem" }}>
                  <Spinner />
                </Flex>
              ) : error ? (
                <Box
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    background: "rgba(244, 67, 54, 0.1)",
                    borderRadius: "var(--border-radius-md)",
                    border: "1px solid rgba(244, 67, 54, 0.2)",
                  }}
                >
                  <Text style={{ color: "#f44336", fontWeight: 600 }}>{error}</Text>
                </Box>
              ) : companies.length === 0 ? (
                <Box style={{ textAlign: "center", padding: "3rem 2rem" }}>
                  <Text style={{ fontSize: "3rem", marginBottom: "1rem", display: "block" }}>🏥</Text>
                  <Heading size="4" style={{ marginBottom: "0.5rem", color: "var(--text-color)" }}>
                    No Services Available Yet
                  </Heading>
                  <Text size="3" style={{ color: "var(--text-light)" }}>
                    Check back soon for medical beauty providers
                  </Text>
                </Box>
              ) : (
                <Flex direction="column" gap="1rem">
                  {companies.map((company) => (
                    <Box
                      key={company.id}
                      style={{
                        padding: "1.5rem",
                        borderRadius: "var(--border-radius-md)",
                        background: "var(--primary-bg)",
                        border: "1px solid var(--border-color)",
                        transition: "var(--transition)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent-primary)";
                        e.currentTarget.style.background = "var(--accent-light)";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-color)";
                        e.currentTarget.style.background = "var(--primary-bg)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="1.5rem" style={{ flex: 1 }}>
                          <Box
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "var(--border-radius-md)",
                              background: "var(--accent-gradient)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: 700,
                              fontSize: "1.2rem",
                            }}
                          >
                            {String(company.name || "C")[0].toUpperCase()}
                          </Box>
                          <Flex direction="column" gap="0.25rem">
                            <Text size="4" style={{ color: "var(--text-color)", fontWeight: 600 }}>
                              {String(company.name || "Unknown Company")}
                            </Text>
                            <Text size="3" style={{ color: "var(--text-light)" }}>
                              {(company.providers?.length || 0)} specialist{(company.providers?.length || 0) !== 1 ? "s" : ""} available
                            </Text>
                          </Flex>
                        </Flex>
                        <Button
                          style={{
                            background: "var(--accent-gradient)",
                            color: "white",
                            cursor: "pointer",
                            padding: "var(--button-padding-md)",
                          }}
                        >
                          View Services
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                </Flex>
              )}
            </Flex>
          </Card>
        </Flex>
      </Box>
    </Box>
  );
}
