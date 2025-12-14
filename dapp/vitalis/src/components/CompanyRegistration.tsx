import { useState } from "react";
import { Box, Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { useVitalisTransactions } from "../useVitalisTransactions";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";

interface CompanyRegistrationProps {
  onSuccess: () => void;
}

type Step = "form" | "wallet" | "register";

export function CompanyRegistration({ onSuccess }: CompanyRegistrationProps) {
  const account = useCurrentAccount();
  const [step, setStep] = useState<Step>("form");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [createdCompanyId, setCreatedCompanyId] = useState<string | null>(null);

  const { createCompany } = useVitalisTransactions();

  const handleContinue = () => {
    if (!companyName.trim()) {
      setError("Company name is required");
      return;
    }
    setError(null);
    setStep("wallet");
  };

  const handleRegister = async () => {
    setError(null);
    setLoading(true);

    try {
      const { companyId, code } = await createCompany(companyName);
      if (companyId && code) {
        setGeneratedCode(code);
        setCreatedCompanyId(companyId);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to register company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: "500px", margin: "0 auto" }}>
      <Flex direction="column" gap="6">
        {/* Step 1: Form */}
        {step === "form" && (
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="2">
              <Heading size="6">Step 1: Fill Out Company Details</Heading>
              <Text size="2" color="gray">Enter your company name</Text>
            </Flex>

            <TextField.Root
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={loading}
              size="3"
            />

            {error && <Text color="red" size="2">{error}</Text>}

            <Button onClick={handleContinue} disabled={loading} size="3" style={{ width: "100%" }}>
              Continue
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

            {account && (
              <Flex gap="2">
                <Button onClick={() => setStep("register")} disabled={loading} size="3" style={{ width: "100%" }}>
                  Next
                </Button>
                <Button onClick={() => setStep("form")} variant="soft" size="3">
                  Back
                </Button>
              </Flex>
            )}
          </Flex>
        )}

        {/* Step 3: Register */}
        {step === "register" && !generatedCode && (
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="2">
              <Heading size="6">Step 3: Complete Registration</Heading>
              <Text size="2" color="gray">Company: <strong>{companyName}</strong></Text>
            </Flex>

            {error && <Text color="red" size="2">{error}</Text>}

            <Button onClick={handleRegister} disabled={loading} size="3" style={{ width: "100%", backgroundColor: "#10b981" }}>
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

        {/* Step 4: Show Code */}
        {generatedCode && (
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="2">
              <Heading size="6">✓ Company Registered!</Heading>
              <Text size="2" color="green">Your company has been created successfully</Text>
            </Flex>

            <Card variant="classic" style={{ backgroundColor: "var(--gray-3)" }}>
              <Flex direction="column" gap="3">
                <Heading size="4">Company Access Code</Heading>
                <Text size="2" color="gray">
                  Share this code with your doctors/providers so they can join your company.
                </Text>
                <Box style={{ padding: "16px", backgroundColor: "var(--gray-1)", borderRadius: "8px", textAlign: "center" }}>
                  <Text size="8" weight="bold" style={{ fontFamily: "monospace", letterSpacing: "4px" }}>
                    {generatedCode}
                  </Text>
                </Box>
                {createdCompanyId && (
                  <Text size="1" color="gray" style={{ wordBreak: "break-all" }}>
                    Company ID: {createdCompanyId}
                  </Text>
                )}
              </Flex>
            </Card>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
