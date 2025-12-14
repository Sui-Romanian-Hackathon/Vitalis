import { Flex, Heading, Box, Button, Badge, Text, Card } from "@radix-ui/themes";
import { getClientData } from "../clientStorage";
import { Calendar, MessageSquare, User, Send, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  currentPage: "businesses" | "account";
  onNavigate: (page: "businesses" | "account") => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const client = getClientData();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Box
      style={{
        background: "var(--secondary-bg)",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "var(--box-shadow-sm)",
      }}
    >
      <Flex
        align="center"
        justify="between"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "1.25rem clamp(1.5rem, 5vw, 3rem)",
          gap: "2rem",
        }}
      >
        {/* Logo & Branding */}
        <Flex
          align="center"
          gap="3"
          style={{
            cursor: "pointer",
            flex: "0 0 auto",
          }}
          onClick={() => onNavigate("businesses")}
        >
          <Box
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "var(--border-radius-sm)",
              background: "var(--accent-gradient)",
              display: "grid",
              placeItems: "center",
              color: "white",
              fontWeight: 600,
              fontSize: "1.1rem",
              boxShadow: "0 2px 8px rgba(176, 70, 162, 0.2)",
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
              letterSpacing: "-0.02em",
              fontWeight: 600,
            }}
          >
            Vitalis
          </Heading>
        </Flex>

        {/* Navigation Links */}
        {client && (
          <Flex gap="0.5rem" align="center" style={{ flex: 1 }}>
            <Button
              onClick={() => onNavigate("businesses")}
              style={{
                background:
                  currentPage === "businesses"
                    ? "var(--accent-gradient)"
                    : "transparent",
                color: currentPage === "businesses" ? "white" : "var(--text-color)",
                border: "none",
                cursor: "pointer",
                padding: "var(--button-padding-md)",
                borderRadius: "var(--border-radius-sm)",
                fontWeight: currentPage === "businesses" ? 500 : 400,
                transition: "var(--transition)",
                boxShadow: currentPage === "businesses" ? "var(--box-shadow-hover)" : "none",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== "businesses") {
                  e.currentTarget.style.background = "var(--accent-very-light)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-sm)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== "businesses") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              Browse Services
            </Button>
            <Button
              onClick={() => onNavigate("account")}
              style={{
                background:
                  currentPage === "account"
                    ? "var(--accent-gradient)"
                    : "transparent",
                color: currentPage === "account" ? "white" : "var(--text-color)",
                border: "none",
                cursor: "pointer",
                padding: "var(--button-padding-md)",
                borderRadius: "var(--border-radius-sm)",
                fontWeight: currentPage === "account" ? 500 : 400,
                transition: "var(--transition)",
                boxShadow: currentPage === "account" ? "var(--box-shadow-hover)" : "none",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== "account") {
                  e.currentTarget.style.background = "var(--accent-very-light)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-sm)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== "account") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              Dashboard
            </Button>
          </Flex>
        )}

        {/* Right Actions */}
        {client ? (
          <Flex gap="1rem" align="center" style={{ flex: "0 0 auto" }}>
            {/* Messages Icon */}
            <Flex
              align="center"
              justify="center"
              onClick={() => setIsChatOpen(!isChatOpen)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--border-radius-sm)",
                background: "transparent",
                cursor: "pointer",
                transition: "var(--transition)",
                position: "relative",
                color: "var(--text-color)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-very-light)";
                e.currentTarget.style.boxShadow = "var(--box-shadow-sm)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
              title="Messages"
            >
              <MessageSquare size={20} strokeWidth={1.5} />
              {2 > 0 && (
                <Badge
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    background: "var(--accent-gradient)",
                    color: "white",
                    fontSize: "0.65rem",
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    fontWeight: 600,
                    border: "2px solid var(--secondary-bg)",
                  }}
                >
                  2
                </Badge>
              )}
            </Flex>

            {/* User Info */}
            <Flex
              align="center"
              gap="2"
              style={{
                padding: "0.625rem 1rem",
                borderRadius: "var(--border-radius-sm)",
                background: "transparent",
                border: "1px solid var(--border-color)",
                transition: "var(--transition)",
                cursor: "pointer",
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
              <Text style={{ fontSize: "0.875rem", color: "var(--text-color)", fontWeight: 500 }}>
                {client.display_name}
              </Text>
            </Flex>
          </Flex>
        ) : null}
      </Flex>

      {/* Chat Window */}
      {isChatOpen && (
        <Box
          style={{
            position: "fixed",
            right: "2rem",
            bottom: "2rem",
            width: "400px",
            height: "600px",
            maxHeight: "calc(100vh - 150px)",
            zIndex: 1000,
          }}
        >
          <Card
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: "var(--secondary-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
              overflow: "hidden",
            }}
          >
            {/* Chat Header */}
            <Flex
              justify="between"
              align="center"
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--border-color)",
                background: "var(--accent-gradient)",
              }}
            >
              <Flex align="center" gap="2">
                <MessageSquare size={20} color="white" strokeWidth={1.5} />
                <Heading size="4" style={{ color: "white", fontWeight: 600 }}>
                  Messages
                </Heading>
              </Flex>
              <Box
                onClick={() => setIsChatOpen(false)}
                style={{
                  cursor: "pointer",
                  padding: "0.25rem",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <X size={20} color="white" strokeWidth={1.5} />
              </Box>
            </Flex>

            {/* Conversations List */}
            <Flex direction="column" style={{ flex: 1, overflowY: "auto" }}>
              {/* Conversation 1 */}
              <Box
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid var(--border-color)",
                  cursor: "pointer",
                  background: "var(--accent-very-light)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-very-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--accent-very-light)";
                }}
              >
                <Flex direction="column" gap="1">
                  <Flex justify="between" align="center">
                    <Text weight="bold" size="3">
                      Cluj Hair Atelier
                    </Text>
                    <Badge
                      style={{
                        background: "var(--accent-gradient)",
                        color: "white",
                        fontSize: "0.65rem",
                      }}
                    >
                      1
                    </Badge>
                  </Flex>
                  <Text size="2" style={{ color: "var(--text-light)" }}>
                    Your appointment has been confirmed for tomorrow at 2 PM
                  </Text>
                  <Text size="1" style={{ color: "#999" }}>
                    10 min ago
                  </Text>
                </Flex>
              </Box>

              {/* Conversation 2 */}
              <Box
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-very-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Flex direction="column" gap="1">
                  <Flex justify="between" align="center">
                    <Text weight="bold" size="3">
                      Napoca Style Studio
                    </Text>
                    <Badge
                      style={{
                        background: "var(--accent-gradient)",
                        color: "white",
                        fontSize: "0.65rem",
                      }}
                    >
                      1
                    </Badge>
                  </Flex>
                  <Text size="2" style={{ color: "var(--text-light)" }}>
                    We have availability for Friday afternoon. Would you like to book?
                  </Text>
                  <Text size="1" style={{ color: "#999" }}>
                    2 hours ago
                  </Text>
                </Flex>
              </Box>

              {/* Conversation 3 - Read */}
              <Box
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-very-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Flex direction="column" gap="1">
                  <Flex justify="between" align="center">
                    <Text weight="bold" size="3">
                      Beauty Center Cluj
                    </Text>
                  </Flex>
                  <Text size="2" style={{ color: "var(--text-light)" }}>
                    Thank you for your feedback! We're glad you enjoyed your visit.
                  </Text>
                  <Text size="1" style={{ color: "#999" }}>
                    Yesterday
                  </Text>
                </Flex>
              </Box>
            </Flex>

            {/* Chat Input (Disabled for demo) */}
            <Flex
              gap="2"
              align="center"
              style={{
                padding: "1rem 1.25rem",
                borderTop: "1px solid var(--border-color)",
                background: "var(--primary-bg)",
              }}
            >
              <input
                placeholder="Select a conversation to reply..."
                disabled
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "#f5f5f5",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-body)",
                  color: "#999",
                  cursor: "not-allowed",
                }}
              />
              <Button
                disabled
                style={{
                  background: "var(--accent-gradient)",
                  color: "white",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  cursor: "not-allowed",
                  opacity: 0.6,
                }}
              >
                <Send size={18} />
              </Button>
            </Flex>
          </Card>
        </Box>
      )}
    </Box>
  );
}

