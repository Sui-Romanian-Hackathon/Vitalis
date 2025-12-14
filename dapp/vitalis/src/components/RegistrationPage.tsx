import { Box, Card, Flex, Heading, Text, Button } from "@radix-ui/themes";
import { ConnectButton } from "@mysten/dapp-kit";
import { ClientRegistration } from "./ClientRegistration";

interface RegistrationPageProps {
  onRegistrationComplete: () => void;
  onBackToLanding?: () => void;
  walletConnected?: boolean;
}

export function RegistrationPage({ onRegistrationComplete, onBackToLanding, walletConnected }: RegistrationPageProps) {
  return (
    <Flex
      direction="column"
      align="center"
      style={{ minHeight: "100vh", background: "#FFFFFF", padding: "clamp(32px, 6vw, 64px)" }}
      gap="5"
    >
      <Flex direction="column" align="center" gap="2" style={{ textAlign: "center", maxWidth: "680px", width: "100%" }}>
        <Heading size="8" style={{ color: "#7B3FF2", letterSpacing: "-0.01em" }}>
          Create Your Account
        </Heading>
        <Text size="4" style={{ color: "#1a1a1a" }}>
          {walletConnected
            ? "Wallet connected, but no account found. Please register to continue."
            : "Get started in a few simple steps to book your first appointment."}
        </Text>
        {onBackToLanding && (
          <Button variant="soft" onClick={onBackToLanding}>
            Back to Home
          </Button>
        )}
        {walletConnected && (
          <Box
            style={{
              marginTop: "12px",
              padding: "12px 16px",
              border: "1px solid #e5e5e5",
              borderRadius: "8px",
              background: "#f8f8f8",
            }}
          >
            <ConnectButton />
          </Box>
        )}
      </Flex>

      <Card
        style={{
          width: "100%",
          maxWidth: "760px",
          padding: "32px",
          border: "2px solid #7B3FF2",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(123, 63, 242, 0.15)",
          background: "#fff",
        }}
      >
        <ClientRegistration onSuccess={onRegistrationComplete} />
      </Card>
    </Flex>
  );
}