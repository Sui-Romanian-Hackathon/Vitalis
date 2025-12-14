import { Box, Button, Card, Flex, Heading, Text, Spinner } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useVitalisTransactions } from "../useVitalisTransactions";

interface Company {
  id: string;
  name: string;
  providers: Array<{ id: string; name: string; role: string; wallet: string }>;
}

interface CompaniesDirectoryProps {
  onClose?: () => void;
}

export function CompaniesDirectory({ onClose }: CompaniesDirectoryProps) {
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
        setCompanies(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  if (loading) {
    return (
      <Box style={{ width: "100%", minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "32px 0" }}>
        <Flex justify="center" align="center" style={{ minHeight: "100vh" }}>
          <Flex direction="column" gap="3" align="center">
            <Spinner />
            <Heading size="4">Loading companies...</Heading>
          </Flex>
        </Flex>
      </Box>
    );
  }

  return (
    <Box style={{ width: "100%", minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "32px 0" }}>
      <Flex direction="column" gap="6" style={{ width: "100%", padding: "0 32px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <Flex justify="between" align="center" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
          <Box>
            <Heading size="8" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
              Companies Directory
            </Heading>
            <Text size="2" color="gray">
              Browse all registered companies and their providers
            </Text>
          </Box>
          {onClose && (
            <Button
              onClick={onClose}
              variant="soft"
              style={{ borderRadius: "12px", padding: "10px 16px" }}
            >
              ← Back
            </Button>
          )}
        </Flex>

        {error && (
          <Card style={{ background: "rgba(239, 68, 68, 0.1)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
            <Text color="red">{error}</Text>
          </Card>
        )}

        {companies.length === 0 ? (
          <Card style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "60px 32px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <Text size="5" style={{ opacity: 0.3, display: "block", marginBottom: "16px" }}>🏥</Text>
            <Heading size="5" style={{ marginBottom: "8px" }}>No companies registered yet</Heading>
            <Text size="2" color="gray">When companies register, they will appear here with their providers.</Text>
          </Card>
        ) : (
          <Flex direction="column" gap="4">
            {companies.map((company) => (
              <Card
                key={company.id}
                style={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  border: "none",
                  padding: "28px",
                  overflow: "hidden",
                }}
              >
                {/* Company Header */}
                <Flex justify="between" align="start" style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "2px solid rgba(102,126,234,0.1)" }}>
                  <Flex align="center" gap="4">
                    <Box
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "24px",
                      }}
                    >
                      {company.name.charAt(0).toUpperCase()}
                    </Box>
                    <Box>
                      <Heading size="5" style={{ marginBottom: "4px" }}>
                        {company.name}
                      </Heading>
                      <Text size="2" color="gray">
                        {company.providers.length} provider{company.providers.length !== 1 ? "s" : ""}
                      </Text>
                    </Box>
                  </Flex>
                  <Box
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    ID: {company.id.slice(0, 8)}...{company.id.slice(-4)}
                  </Box>
                </Flex>

                {/* Providers List */}
                {company.providers.length === 0 ? (
                  <Box style={{ textAlign: "center", padding: "40px 20px" }}>
                    <Text size="3" style={{ opacity: 0.3, display: "block", marginBottom: "8px" }}>👨‍⚕️</Text>
                    <Text size="2" color="gray">No providers yet</Text>
                  </Box>
                ) : (
                  <Flex direction="column" gap="3">
                    {company.providers.map((provider) => (
                      <Box
                        key={provider.id}
                        style={{
                          background: "rgba(16, 185, 129, 0.05)",
                          borderRadius: "12px",
                          padding: "16px",
                          border: "1px solid rgba(16, 185, 129, 0.1)",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(16, 185, 129, 0.3)";
                          (e.currentTarget as HTMLElement).style.background = "rgba(16, 185, 129, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(16, 185, 129, 0.1)";
                          (e.currentTarget as HTMLElement).style.background = "rgba(16, 185, 129, 0.05)";
                        }}
                      >
                        <Flex justify="between" align="center">
                          <Flex align="center" gap="3">
                            <Box
                              style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "16px",
                              }}
                            >
                              {provider.name.charAt(0).toUpperCase()}
                            </Box>
                            <Box>
                              <Text weight="bold" size="3" style={{ display: "block", marginBottom: "4px" }}>
                                {provider.name}
                              </Text>
                              <Text size="2" color="gray" style={{ display: "block", marginBottom: "2px" }}>
                                <strong>Role:</strong> {provider.role}
                              </Text>
                              <Text size="1" color="gray">
                                {provider.wallet.slice(0, 10)}...{provider.wallet.slice(-8)}
                              </Text>
                            </Box>
                          </Flex>
                          <Box
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "#059669",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            ● Active
                          </Box>
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                )}
              </Card>
            ))}
          </Flex>
        )}

        {/* Summary Stats */}
        {companies.length > 0 && (
          <Card
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              border: "none",
              padding: "28px",
            }}
          >
            <Flex justify="between" align="center">
              <Flex direction="column" gap="2">
                <Heading size="5">Directory Stats</Heading>
                <Text size="2" color="gray">Overview of the platform</Text>
              </Flex>
              <Flex gap="6" align="center">
                <Box style={{ textAlign: "center" }}>
                  <Text size="5" weight="bold" style={{ color: "#667eea", display: "block" }}>
                    {companies.length}
                  </Text>
                  <Text size="2" color="gray">Companies</Text>
                </Box>
                <Box style={{ width: "1px", height: "50px", background: "rgba(0,0,0,0.1)" }} />
                <Box style={{ textAlign: "center" }}>
                  <Text size="5" weight="bold" style={{ color: "#10b981", display: "block" }}>
                    {companies.reduce((sum, c) => sum + c.providers.length, 0)}
                  </Text>
                  <Text size="2" color="gray">Total Providers</Text>
                </Box>
              </Flex>
            </Flex>
          </Card>
        )}
      </Flex>
    </Box>
  );
}
