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
    </Box>
  );
}

