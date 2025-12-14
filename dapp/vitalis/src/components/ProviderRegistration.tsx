import { useState } from "react";
import { Button, Card, Flex, Heading, Text, TextField, Box } from "@radix-ui/themes";
import { useVitalisTransactions } from "../useVitalisTransactions";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
import { CompanyProfile } from "../types";
import { useSuiClient } from "@mysten/dapp-kit";

interface ProviderRegistrationProps {
  company: CompanyProfile | undefined;
  onSuccess: () => void;
}

type Step = "form" | "wallet" | "register";

export function ProviderRegistration({
  company: _company,
  onSuccess,
}: ProviderRegistrationProps) {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState<string | null>(null);

  const { mintProviderNFT, getCompanyIdByAccessCode } = useVitalisTransactions();

  const handleContinue = async () => {
    if (!name.trim()) {
      setError("Provider name is required");
      return;
    }
    if (!role.trim()) {
      setError("Role is required");
      return;
    }
    if (!joinCode.trim()) {
      setError("Company access code is required");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Lookup company by access code
      const companyId = getCompanyIdByAccessCode(joinCode.trim());
      if (!companyId) {
        setError("Invalid company access code");
        setLoading(false);
        return;
      }

      // Fetch company details
      const companyObj = await client.getObject({
        id: companyId,
        options: { showType: true, showContent: true },
      });
      
      const companyContent: any = companyObj?.data?.content as any;
      const companyFields = companyContent?.fields || {};
      const fetchedCompanyName = companyFields.name || "Unknown Company";
      
      setCompanyName(fetchedCompanyName);
      setLoading(false);
      setStep("wallet");
    } catch (err: any) {
      setError("Failed to validate company code: " + (err?.message || "Unknown error"));
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      console.log("Starting mintProviderNFT for:", name, role, joinCode);
      await mintProviderNFT(name, joinCode);
      console.log("mintProviderNFT successful, calling onSuccess");
      onSuccess();
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMsg = err?.message || err?.toString?.() || "Failed to register as provider";
      console.error("Error message:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Flex direction="column" gap="6">
        {/* Step 1: Form */}
        {step === "form" && (
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="2">
              <Heading size="6">Step 1: Provider Details</Heading>
              <Text size="2" color="gray">Enter your name, role, and the company's access code</Text>
            </Flex>

            <TextField.Root
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              size="3"
            />

            <TextField.Root
              placeholder="Role (e.g., Dermatologist, Nurse)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              size="3"
            />

            <TextField.Root
              placeholder="Company Access Code (6 digits)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              disabled={loading}
              size="3"
            />

            {companyName && (
              <Box style={{ background: "rgba(16, 185, 129, 0.1)", borderRadius: "8px", padding: "12px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                <Text size="2" color="green">
                  ✓ Company found: <strong>{companyName}</strong>
                </Text>
              </Box>
            )}

            {error && <Text color="red" size="2">{error}</Text>}

            <Button onClick={handleContinue} disabled={loading} size="3" style={{ width: "100%" }}>
              {loading ? "Validating..." : "Continue"}
            </Button>
          </Flex>
        )}

        {/* Step 2: Wallet */}
        {step === "wallet" && (
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="2">
              <Heading size="6">Step 2: Connect Your Wallet</Heading>
              <Text size="2" color="gray">Click below to connect your Sui wallet</Text>
            </Flex>

            <Box style={{ textAlign: "center", padding: "20px" }}>
              <ConnectButton />
            </Box>

            <Flex gap="2">
              <Button onClick={() => setStep("register")} disabled={loading || !account} size="3" style={{ width: "100%" }}>
                {account ? "Next" : "Connect wallet to continue"}
              </Button>
              <Button onClick={() => setStep("form")} variant="soft" size="3">
                Back
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Step 3: Register */}
        {step === "register" && (
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="2">
              <Heading size="6">Step 3: Complete Registration</Heading>
              <Text size="2" color="gray">Name: <strong>{name}</strong></Text>
              <Text size="2" color="gray">Role: <strong>{role}</strong></Text>
              {companyName && <Text size="2" color="gray">Company: <strong>{companyName}</strong></Text>}
            </Flex>

            {!account && (
              <Box style={{ textAlign: "center" }}>
                <Text size="2" color="red">Wallet not connected. Please connect to proceed.</Text>
                <Box style={{ marginTop: "8px" }}>
                  <ConnectButton />
                </Box>
              </Box>
            )}

            {error && <Text color="red" size="2">{error}</Text>}

            <Button onClick={handleRegister} disabled={loading || !account} size="3" style={{ width: "100%", backgroundColor: "#10b981" }}>
              {loading ? "Registering..." : "Finish Registration"}
            </Button>

            <Button onClick={() => setStep("wallet")} variant="soft" size="3">
              Back
            </Button>

            <Box style={{ marginTop: "16px", textAlign: "center" }}>
              <Text size="2" color="gray">Already have an account?</Text>
              <Box style={{ marginTop: "8px" }}>
                <ConnectButton />
              </Box>
            </Box>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
