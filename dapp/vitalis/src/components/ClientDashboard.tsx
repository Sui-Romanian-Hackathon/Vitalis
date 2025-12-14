import { Box, Card, Flex, Heading, Text, Button } from "@radix-ui/themes";
import { ClientNFT } from "../types";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { BusinessesPage } from "./BusinessesPage";

interface ClientDashboardProps {
  client: ClientNFT;
}

export function ClientDashboard({ client }: ClientDashboardProps) {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <Flex style={{ minHeight: "100vh", background: "var(--primary-bg)" }}>
      {/* Sidebar */}
      <Sidebar accountType="client" onNavigate={setActiveSection} isOpen={true} />

      {/* Main Content */}
      <Box
        style={{
          marginLeft: "280px",
          flex: 1,
          minHeight: "100vh",
        }}
      >
        {/* Top Header */}
        <Box
          style={{
            background: "var(--secondary-bg)",
            borderBottom: "1px solid var(--border-color)",
            padding: "1.5rem clamp(1.5rem, 5vw, 3rem)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <Flex justify="between" align="center">
            <Heading size="7" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
              {activeSection === "home" && "Browse Services"}
              {activeSection === "schedule" && "Schedule Appointment"}
              {activeSection === "manage" && "Manage Appointments"}
              {activeSection === "record" && "Appointments Record"}
              {activeSection === "messages" && "Messages"}
              {activeSection === "notifications" && "Notifications"}
            </Heading>
            <Flex align="center" gap="3">
              <Text size="3" style={{ color: "var(--text-light)" }}>
                {client.display_name || "User"}
              </Text>
            </Flex>
          </Flex>
        </Box>

        {/* Content Area */}
        <Box style={{ padding: "2rem clamp(1.5rem, 5vw, 3rem)" }}>
          {activeSection === "home" && <BusinessesPage />}
          {activeSection === "schedule" && <BusinessesPage />}
          {activeSection === "manage" && (
            <Card style={{ padding: "2rem", textAlign: "center" }}>
              <Text size="4" style={{ color: "var(--text-light)" }}>
                Manage Appointments - Coming Soon
              </Text>
            </Card>
          )}
          {activeSection === "record" && (
            <Card style={{ padding: "2rem", textAlign: "center" }}>
              <Text size="4" style={{ color: "var(--text-light)" }}>
                Appointments Record - Coming Soon
              </Text>
            </Card>
          )}
          {activeSection === "messages" && (
            <Card style={{ padding: "2rem", textAlign: "center" }}>
              <Text size="4" style={{ color: "var(--text-light)" }}>
                Messages - Coming Soon
              </Text>
            </Card>
          )}
          {activeSection === "notifications" && (
            <Card style={{ padding: "2rem", textAlign: "center" }}>
              <Text size="4" style={{ color: "var(--text-light)" }}>
                Notifications - Coming Soon
              </Text>
            </Card>
          )}
        </Box>
      </Box>
    </Flex>
  );
}
              background: "var(--accent-gradient)",
              display: "grid",
              placeItems: "center",
              color: "white",
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            V
          </Box>
          <Heading
            size="5"
            style={{
              fontFamily: "var(--font-heading)",
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 600,
            }}
          >
            Vitalis
          </Heading>
        </Flex>

        {/* Navigation Items */}
        <Flex direction="column" style={{ flex: 1, padding: "1rem 0" }}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebarItem === item.id;
            return (
              <Flex
                key={item.id}
                align="center"
                gap="3"
                style={{
                  padding: "0.875rem 1.5rem",
                  cursor: "pointer",
                  transition: "var(--transition)",
                  background: isActive ? "var(--accent-very-light)" : "transparent",
                  borderLeft: isActive ? "3px solid var(--accent-primary)" : "3px solid transparent",
                  color: isActive ? "var(--accent-primary)" : "var(--text-color)",
                  fontWeight: isActive ? 500 : 400,
                  position: "relative",
                }}
                onClick={() => setActiveSidebarItem(item.id)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "var(--accent-very-light)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <Icon size={20} strokeWidth={1.5} />
                <Text size="3">{item.label}</Text>
                {item.badge && item.badge > 0 && (
                  <Box
                    style={{
                      position: "absolute",
                      right: "1.5rem",
                      background: "var(--accent-gradient)",
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </Flex>
            );
          })}
        </Flex>

        {/* Bottom Items */}
        <Flex direction="column" style={{ borderTop: "1px solid var(--border-color)", padding: "1rem 0" }}>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <Flex
                key={item.id}
                align="center"
                gap="3"
                style={{
                  padding: "0.875rem 1.5rem",
                  cursor: "pointer",
                  transition: "var(--transition)",
                  color: "var(--text-color)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-very-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={20} strokeWidth={1.5} />
                <Text size="3">{item.label}</Text>
              </Flex>
            );
          })}
        </Flex>

        {/* Account Type Badge */}
        <Box
          style={{
            padding: "1.5rem",
            borderTop: "1px solid var(--border-color)",
            background: "var(--accent-very-light)",
          }}
        >
          <Text size="2" style={{ color: "var(--text-light)", display: "block", marginBottom: "0.25rem" }}>
            Account Type
          </Text>
          <Text
            size="3"
            weight="bold"
            style={{
              color: "var(--accent-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            CLIENT
          </Text>
        </Box>
      </Box>

      {/* Main Content */}
      <Box style={{ marginLeft: "280px", flex: 1 }}>
        {/* Top Bar */}
        <Flex
          align="center"
          justify="between"
          style={{
            padding: "1.5rem 2rem",
            background: "var(--secondary-bg)",
            borderBottom: "1px solid var(--border-color)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Heading size="6" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
            {client.display_name}
          </Heading>

          <Flex align="center" gap="3">
            {/* Search */}
            <Box style={{ position: "relative" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-light)",
                }}
              />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  paddingLeft: "2.5rem",
                  paddingRight: "1rem",
                  height: "40px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--border-radius-sm)",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-body)",
                  background: "var(--primary-bg)",
                  color: "var(--text-color)",
                  transition: "var(--transition)",
                  width: "280px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-primary)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-very-light)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </Box>

            {/* User Avatar */}
            <Flex
              align="center"
              gap="2"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--border-radius-sm)",
                background: "transparent",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-very-light)";
                e.currentTarget.style.boxShadow = "var(--box-shadow-sm)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <User size={18} strokeWidth={1.5} />
              <Text size="2" weight="medium">
                {client.display_name.split(" ")[0]}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        {/* Dashboard Content */}
        <Box style={{ padding: "2rem" }}>
          <Flex direction="column" gap="2rem">
            {/* Next Appointment Section */}
            <Box>
              <Flex align="center" justify="between" style={{ marginBottom: "1rem" }}>
                <Heading size="5" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                  Next Appointment
                </Heading>
                <Button
                  size="2"
                  style={{
                    background: "transparent",
                    color: "var(--accent-primary)",
                    border: "1px solid var(--border-color)",
                    cursor: "pointer",
                    borderRadius: "var(--border-radius-sm)",
                    padding: "0.5rem 1rem",
                    fontWeight: 400,
                    transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent-very-light)";
                    e.currentTarget.style.boxShadow = "var(--box-shadow-sm)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  View All
                </Button>
              </Flex>

              <Card
                style={{
                  padding: "0",
                  background: "var(--secondary-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--border-radius-lg)",
                  boxShadow: "var(--box-shadow-sm)",
                  overflow: "hidden",
                }}
              >
                <Box
                  style={{
                    background: "var(--accent-gradient)",
                    padding: "1rem 1.5rem",
                    color: "white",
                  }}
                >
                  <Flex align="center" gap="2">
                    <Calendar size={20} strokeWidth={1.5} />
                    <Text size="2" weight="medium">
                      No upcoming appointments
                    </Text>
                  </Flex>
                </Box>
                <Box style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
                  <Text size="3" style={{ color: "var(--text-light)", display: "block", marginBottom: "1.5rem" }}>
                    Schedule your first appointment
                  </Text>
                  <Button
                    size="3"
                    style={{
                      background: "var(--accent-gradient)",
                      color: "white",
                      cursor: "pointer",
                      borderRadius: "var(--border-radius-sm)",
                      padding: "0.75rem 2rem",
                      fontWeight: 500,
                      transition: "var(--transition)",
                      boxShadow: "var(--box-shadow-sm)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "var(--box-shadow-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "var(--box-shadow-sm)";
                    }}
                  >
                    <Flex align="center" gap="2">
                      <Plus size={18} />
                      Schedule Appointment
                    </Flex>
                  </Button>
                </Box>
              </Card>
            </Box>

            {/* Quick Actions */}
            <Box>
              <Heading size="5" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, marginBottom: "1rem" }}>
                Quick Actions
              </Heading>
              <Flex gap="1rem" wrap="wrap">
                {[
                  { icon: Calendar, label: "Schedule Appointment", subtitle: "Book a new appointment" },
                  { icon: FileText, label: "Manage Appointments", subtitle: "Reschedule or cancel" },
                  { icon: FileText, label: "Appointments Record", subtitle: "Your full history" },
                ].map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <Card
                      key={i}
                      style={{
                        flex: "1 1 280px",
                        padding: "1.5rem",
                        background: "var(--secondary-bg)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--border-radius-md)",
                        cursor: "pointer",
                        transition: "var(--transition)",
                        boxShadow: "var(--box-shadow-sm)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "var(--box-shadow-hover)";
                        e.currentTarget.style.borderColor = "var(--accent-primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "var(--box-shadow-sm)";
                        e.currentTarget.style.borderColor = "var(--border-color)";
                      }}
                    >
                      <Flex align="center" gap="3">
                        <Box
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "var(--border-radius-sm)",
                            background: "var(--accent-very-light)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--accent-primary)",
                          }}
                        >
                          <Icon size={24} strokeWidth={1.5} />
                        </Box>
                        <Flex direction="column" gap="1">
                          <Text size="3" weight="medium">
                            {action.label}
                          </Text>
                          <Text size="2" style={{ color: "var(--text-light)" }}>
                            {action.subtitle}
                          </Text>
                        </Flex>
                      </Flex>
                    </Card>
                  );
                })}
              </Flex>
            </Box>

            {/* Recent Notifications */}
            <Box>
              <Heading size="5" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, marginBottom: "1rem" }}>
                Recent Notifications
              </Heading>
              <Card
                style={{
                  padding: "1.5rem",
                  background: "var(--secondary-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--border-radius-md)",
                  boxShadow: "var(--box-shadow-sm)",
                }}
              >
                <Flex align="center" gap="3" style={{ padding: "1rem", background: "var(--accent-very-light)", borderRadius: "var(--border-radius-sm)" }}>
                  <Bell size={20} color="var(--accent-primary)" strokeWidth={1.5} />
                  <Flex direction="column" gap="1" style={{ flex: 1 }}>
                    <Text size="3" weight="medium">
                      Welcome to Vitalis! This is your first login.
                    </Text>
                    <Text size="2" style={{ color: "var(--text-light)" }}>
                      Start by scheduling an appointment.
                    </Text>
                  </Flex>
                  <Text size="2" style={{ color: "var(--text-lighter)" }}>
                    1h ago
                  </Text>
                </Flex>
              </Card>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}
