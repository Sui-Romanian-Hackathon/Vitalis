import { useState } from "react";
import { Box, Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
import { useVitalisTransactions } from "../useVitalisTransactions";
import { saveClientData } from "../clientStorage";

interface ClientRegistrationProps {
  onSuccess: () => void;
}

type Step = "name" | "wallet" | "confirm" | "processing";

const gradientBackground = "linear-gradient(135deg, #b046a2 0%, #faa7d1 100%)";

export function ClientRegistration({ onSuccess }: ClientRegistrationProps) {
  const account = useCurrentAccount();
  const [step, setStep] = useState<Step>("name");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { mintClientNFT } = useVitalisTransactions();

  const handleNameContinue = () => {
    if (!displayName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setError(null);
    setStep("wallet");
  };

  const handleWalletConnect = () => {
    if (!account?.address) {
      setError("Wallet not connected");
      return;
    }
    setError(null);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!account?.address) {
        setError("Wallet not connected");
        setLoading(false);
        return;
      }

      // Mint client NFT on-chain
      const { clientId } = await mintClientNFT(displayName);

      if (!clientId) {
        setError("Failed to create identity NFT");
        setLoading(false);
        return;
      }

      // Save client data locally
      const clientData = {
        id: clientId,
        wallet: account.address,
        display_name: displayName,
        email,
        created_at: Math.floor(Date.now() / 1000),
      };

      await saveClientData(clientData);

      setStep("processing");
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setStep("confirm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        maxWidth: "460px",
        width: "100%",
        padding: "2.5rem",
        background: "var(--secondary-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--border-radius-lg)",
        boxShadow: "var(--box-shadow-lg)",
        margin: "0 auto",
      }}
    >
      <Flex
        direction="column"
        gap="2rem"
        align="center"
        style={{
          minHeight: step === "name" ? "auto" : "400px",
          width: "100%",
        }}
      >
        {/* Step 1: Name and Email */}
        {step === "name" && (
          <Flex direction="column" gap="1.5rem" style={{ width: "100%" }}>
            <Heading size="6" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, textAlign: "center" }}>
              Create Your Account
            </Heading>

            <Box style={{ width: "100%" }}>
              <Text size="2" style={{ color: "var(--text-light)", marginBottom: "0.5rem", display: "block" }}>
                Full Name
              </Text>
              <TextField.Root
                placeholder="Enter your full name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
                size="3"
              />
            </Box>

            <Box>
              <Text size="2" style={{ color: "var(--text-light)", marginBottom: "0.5rem", display: "block" }}>
                Email
              </Text>
              <TextField.Root
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                size="3"
              />
            </Box>

            {error && (
              <Box
                style={{
                  padding: "0.75rem",
                  background: "rgba(244, 67, 54, 0.1)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid rgba(244, 67, 54, 0.3)",
                }}
              >
                <Text size="2" style={{ color: "#f44336" }}>
                  {error}
                </Text>
              </Box>
            )}

            <Button
              onClick={handleNameContinue}
              disabled={loading}
              style={{
                width: "100%",
                maxWidth: "100%",
                height: "48px",
                background: gradientBackground,
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 500,
                borderRadius: "var(--border-radius-sm)",
                transition: "var(--transition)",
                boxShadow: "var(--box-shadow-md)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "var(--box-shadow-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--box-shadow-md)";
              }}
            >
              Continue
            </Button>
          </Flex>
        )}

        {/* Step 2: Connect Wallet */}
        {step === "wallet" && (
          <Flex direction="column" gap="2rem">
            <Flex direction="column" gap="1rem">
              <Heading size="6" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                Connect Your Wallet
              </Heading>
              <Text size="3" style={{ color: "var(--text-light)", lineHeight: 1.6 }}>
                Link your Sui wallet to create your identity on-chain
              </Text>
            </Flex>

            <Box
              style={{
                padding: "2rem",
                background: "var(--accent-very-light)",
                borderRadius: "var(--border-radius-md)",
                border: "1px solid var(--border-color)",
                textAlign: "center",
              }}
            >
              <ConnectButton />
            </Box>

            {error && (
              <Box
                style={{
                  padding: "0.75rem",
                  background: "rgba(244, 67, 54, 0.1)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid rgba(244, 67, 54, 0.3)",
                }}
              >
                <Text size="2" style={{ color: "#f44336" }}>
                  {error}
                </Text>
              </Box>
            )}

            <Button
              onClick={handleWalletConnect}
              disabled={loading || !account?.address}
              style={{
                width: "100%",
                height: "48px",
                background: account?.address ? gradientBackground : "#ccc",
                color: "white",
                border: "none",
                cursor: account?.address ? "pointer" : "not-allowed",
                fontSize: "1rem",
                fontWeight: 500,
                borderRadius: "var(--border-radius-sm)",
                transition: "var(--transition)",
                boxShadow: account?.address ? "var(--box-shadow-md)" : "none",
              }}
              onMouseEnter={(e) => {
                if (account?.address) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (account?.address) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--box-shadow-md)";
                }
              }}
            >
              {account?.address ? "Continue" : "Waiting for wallet..."}
            </Button>

            <Button
              onClick={() => setStep("name")}
              variant="outline"
              style={{
                width: "100%",
                height: "48px",
                background: "transparent",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 400,
                borderRadius: "var(--border-radius-sm)",
                transition: "var(--transition)",
              }}
            >
              Back
            </Button>
          </Flex>
        )}

        {/* Step 3: Confirm Details */}
        {step === "confirm" && account?.address && (
          <Flex direction="column" gap="2rem">
            <Flex direction="column" gap="1rem">
              <Heading size="6" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                Confirm Your Details
              </Heading>
              <Text size="3" style={{ color: "var(--text-light)", lineHeight: 1.6 }}>
                Review before creating your identity NFT
              </Text>
            </Flex>

            <Box
              style={{
                padding: "1.5rem",
                background: "var(--accent-very-light)",
                borderRadius: "var(--border-radius-md)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Flex direction="column" gap="1rem">
                <Flex justify="between" align="center">
                  <Text size="2" weight="bold" style={{ color: "var(--text-color)" }}>
                    Name:
                  </Text>
                  <Text size="2" style={{ color: "var(--text-color)" }}>
                    {displayName}
                  </Text>
                </Flex>
                <Box style={{ height: "1px", background: "var(--border-color)" }} />
                <Flex justify="between" align="center">
                  <Text size="2" weight="bold" style={{ color: "var(--text-color)" }}>
                    Email:
                  </Text>
                  <Text size="2" style={{ color: "var(--text-color)" }}>
                    {email}
                  </Text>
                </Flex>
                <Box style={{ height: "1px", background: "var(--border-color)" }} />
                <Flex justify="between" align="center">
                  <Text size="2" weight="bold" style={{ color: "var(--text-color)" }}>
                    Wallet:
                  </Text>
                  <Text size="2" style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--text-color)" }}>
                    {account.address.slice(0, 6)}...{account.address.slice(-6)}
                  </Text>
                </Flex>
              </Flex>
            </Box>

            {error && (
              <Box
                style={{
                  padding: "0.75rem",
                  background: "rgba(244, 67, 54, 0.1)",
                  borderRadius: "var(--border-radius-sm)",
                  border: "1px solid rgba(244, 67, 54, 0.3)",
                }}
              >
                <Text size="2" style={{ color: "#f44336" }}>
                  {error}
                </Text>
              </Box>
            )}

            <Button
              onClick={handleConfirm}
              disabled={loading}
              style={{
                width: "100%",
                height: "48px",
                background: gradientBackground,
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 500,
                borderRadius: "var(--border-radius-sm)",
                transition: "var(--transition)",
                boxShadow: "var(--box-shadow-md)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "var(--box-shadow-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--box-shadow-md)";
              }}
            >
              {loading ? "Creating Profile..." : "Create Profile"}
            </Button>

            <Button
              onClick={() => setStep("wallet")}
              variant="outline"
              style={{
                width: "100%",
                height: "48px",
                background: "transparent",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 400,
                borderRadius: "var(--border-radius-sm)",
                transition: "var(--transition)",
              }}
            >
              Back
            </Button>
          </Flex>
        )}

        {/* Step 4: Processing */}
        {step === "processing" && (
          <Flex direction="column" gap="2rem" align="center" justify="center" style={{ padding: "2rem 0" }}>
            <Box
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: gradientBackground,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "pulse 2s ease-in-out infinite",
              }}
            >
              <Text size="5" style={{ color: "white" }}>
                ✓
              </Text>
            </Box>
            <Heading size="6" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
              Welcome
            </Heading>
            <Text size="3" style={{ color: "var(--text-light)", textAlign: "center" }}>
              Your profile has been created successfully. Redirecting to dashboard...
            </Text>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
