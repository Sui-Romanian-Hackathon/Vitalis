import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
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
