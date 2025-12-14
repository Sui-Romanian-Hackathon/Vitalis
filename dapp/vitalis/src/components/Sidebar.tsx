import { Flex, Box, Text } from "@radix-ui/themes";
import { useState } from "react";
import {
  Home,
  Calendar,
  FileText,
  MessageSquare,
  Bell,
  Users,
  CheckSquare,
  BarChart3,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  accountType?: "client" | "provider" | "company";
  authStatus?: "pending" | "approved" | "rejected";
  onNavigate?: (section: string) => void;
  isOpen?: boolean;
}

export function Sidebar({ accountType = "client", authStatus, onNavigate, isOpen = true }: SidebarProps) {
  const [activeSection, setActiveSection] = useState("home");

  const baseMenuItems = [
    { icon: Home, label: "Home", section: "home" },
    { icon: Calendar, label: "Schedule Appointment", section: "schedule" },
    { icon: FileText, label: "Manage Appointments", section: "manage" },
    { icon: FileText, label: "Appointments Record", section: "record" },
    { icon: MessageSquare, label: "Messages", section: "messages" },
    { icon: Bell, label: "Notifications", section: "notifications", badge: 1 },
  ];

  const providerMenuItems = [
    { icon: Home, label: "Home", section: "home" },
    { icon: FileText, label: "Manage Appointments", section: "manage" },
    { icon: Users, label: "Clients", section: "clients" },
    { icon: FileText, label: "Appointments Record", section: "record" },
    { icon: CheckSquare, label: "Professional Tasks", section: "tasks" },
    { icon: MessageSquare, label: "Messages", section: "messages" },
    { icon: Bell, label: "Notifications", section: "notifications" },
  ];

  const companyMenuItems = [
    { icon: Home, label: "Home", section: "home" },
    { icon: FileText, label: "Manage Appointments", section: "manage" },
    { icon: Users, label: "Manage Personnel", section: "personnel" },
    { icon: BarChart3, label: "Operational Overview", section: "overview" },
    { icon: MessageSquare, label: "Messages", section: "messages" },
    { icon: Bell, label: "Notifications", section: "notifications" },
  ];

  const bottomMenuItems = [
    { icon: HelpCircle, label: "Help", section: "help" },
    { icon: Settings, label: "Settings", section: "settings" },
    { icon: LogOut, label: "Log Out", section: "logout" },
  ];

  let menuItems = baseMenuItems;
  if (accountType === "provider") {
    menuItems = providerMenuItems;
  } else if (accountType === "company") {
    menuItems = companyMenuItems;
  }

  const handleMenuItemClick = (section: string) => {
    setActiveSection(section);
    if (onNavigate) {
      onNavigate(section);
    }
  };

  return (
    <Box
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: isOpen ? "280px" : "0",
        background: "var(--secondary-bg)",
        borderRight: "1px solid var(--border-color)",
        overflow: "hidden",
        transition: "var(--transition)",
        zIndex: 50,
        paddingTop: "60px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Flex direction="column" style={{ flex: 1, overflowY: "auto", padding: "1rem 0" }}>
        {/* Authorization Status - Provider/Company Only */}
        {(accountType === "provider" || accountType === "company") && authStatus && (
          <Box
            style={{
              padding: "1rem 1.5rem",
              margin: "0 1rem 1.5rem 1rem",
              borderRadius: "var(--border-radius-sm)",
              background: authStatus === "approved" 
                ? "rgba(76, 175, 80, 0.08)" 
                : authStatus === "rejected"
                ? "rgba(244, 67, 54, 0.08)"
                : "rgba(255, 193, 7, 0.08)",
              border: `1px solid ${
                authStatus === "approved"
                  ? "rgba(76, 175, 80, 0.2)"
                  : authStatus === "rejected"
                  ? "rgba(244, 67, 54, 0.2)"
                  : "rgba(255, 193, 7, 0.2)"
              }`,
            }}
          >
            <Text
              size="2"
              weight="medium"
              style={{
                color: authStatus === "approved" 
                  ? "#4caf50" 
                  : authStatus === "rejected"
                  ? "#f44336"
                  : "#ffc107",
              }}
            >
              Status: {authStatus.charAt(0).toUpperCase() + authStatus.slice(1)}
            </Text>
          </Box>
        )}

        {/* Main Menu Items */}
        <Flex direction="column">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;
            return (
              <Flex
                key={item.section}
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
                onClick={() => handleMenuItemClick(item.section)}
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
      </Flex>

      {/* Bottom Menu Items */}
      <Flex
        direction="column"
        style={{
          padding: "1rem 0",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Flex
              key={item.section}
              align="center"
              gap="3"
              style={{
                padding: "0.875rem 1.5rem",
                cursor: "pointer",
                transition: "var(--transition)",
                color: "var(--text-color)",
              }}
              onClick={() => handleMenuItemClick(item.section)}
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
            textTransform: "uppercase",
          }}
        >
          {accountType}
        </Text>
      </Box>
    </Box>
  );
}
