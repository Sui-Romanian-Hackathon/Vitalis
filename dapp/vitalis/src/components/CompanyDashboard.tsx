import { Box, Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { CompanyProfile } from "../types";
import { useVitalisTransactions } from "../useVitalisTransactions";
import { useEffect, useMemo, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";

interface CompanyDashboardProps {
  company: CompanyProfile;
}

export function CompanyDashboard({ company }: CompanyDashboardProps) {
  const { getCompanyCode, setOrGenerateCompanyCode, getProvidersForCompany, getProviderRequests, setProviderRequestStatus, issueProviderApproval } = useVitalisTransactions();
  const client = useSuiClient();
  const [providerIds, setProviderIds] = useState<string[]>([]);
  const [providers, setProviders] = useState<Array<{ id: string; name: string; role: string; wallet: string }>>([]);
  const [manualProviderId, setManualProviderId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<Array<{ wallet: string; name: string; createdAt: number; status: "pending" | "approved" | "rejected" }>>([]);

  const code = useMemo(() => getCompanyCode(company.id), [company.id, getCompanyCode]);

  useEffect(() => {
    setProviderIds(getProvidersForCompany(company.id));
    setRequests(getProviderRequests(company.id));
  }, [company.id, getProvidersForCompany]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const results: Array<{ id: string; name: string; role: string; wallet: string }> = [];
      for (const pid of providerIds) {
        try {
          const obj = await client.getObject({ id: pid, options: { showType: true, showContent: true } });
          const content: any = obj?.data?.content as any;
          const fields = content?.fields || {};
          const type = obj?.data?.type || "";
          if (type.includes("vitalis_identity::ProviderNFT") && String(fields.company_id) === company.id) {
            results.push({ id: pid, name: fields.name, role: fields.role, wallet: fields.wallet });
          }
        } catch (e) {
          // ignore
        }
      }
      if (!cancelled) setProviders(results);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [providerIds, client, company.id]);

  const refreshRequests = () => {
    setRequests(getProviderRequests(company.id));
  };

  const handleApproveRequest = async (wallet: string, name: string) => {
    await issueProviderApproval(company.id, wallet, name);
    setProviderRequestStatus(company.id, wallet, "approved");
    refreshRequests();
  };

  const handleRejectRequest = (wallet: string) => {
    setProviderRequestStatus(company.id, wallet, "rejected");
    refreshRequests();
  };

  const handleAddProviderById = async () => {
    setError(null);
    try {
      const obj = await client.getObject({ id: manualProviderId.trim(), options: { showType: true, showContent: true } });
      const type = obj?.data?.type || "";
      const content: any = obj?.data?.content as any;
      const fields = content?.fields || {};
      if (!type.includes("vitalis_identity::ProviderNFT")) {
        throw new Error("Not a Provider NFT");
      }
      if (String(fields.company_id) !== company.id) {
        throw new Error("Provider does not belong to this company");
      }
      setProviderIds((prev) => Array.from(new Set([...prev, manualProviderId.trim()])));
      setManualProviderId("");
    } catch (e: any) {
      setError(e?.message || "Failed to add provider");
    }
  };

  return (
    <Box style={{ width: "100%", minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "32px 0" }}>
      <Flex direction="column" gap="6" style={{ width: "100%", padding: "0 32px" }}>
        {/* Header Section */}
        <Flex justify="between" align="center" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
          <Box>
            <Heading size="8" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
              {company.name}
            </Heading>
            <Flex gap="4" align="center">
              <Text size="2" color="gray">
                <strong>Status:</strong> <span style={{ color: company.status === 0 ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                  {company.status === 0 ? "● Active" : "● Inactive"}
                </span>
              </Text>
              <Text size="2" color="gray">
                <strong>Created:</strong> {new Date(company.created_at * 1000).toLocaleDateString()}
              </Text>
            </Flex>
          </Box>
          {code && (
            <Box style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: "16px", padding: "20px 40px", boxShadow: "0 10px 30px rgba(102,126,234,0.3)" }}>
              <Text size="1" style={{ color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "2px", fontSize: "11px", marginBottom: "8px", display: "block" }}>
                Access Code
              </Text>
              <Text size="8" weight="bold" style={{ color: "#fff", fontFamily: "monospace", letterSpacing: "8px" }}>
                {code}
              </Text>
            </Box>
          )}
        </Flex>

        {/* Main Content Grid */}
        <Flex gap="6" style={{ alignItems: "flex-start" }}>
          {/* Left Column - Provider Management */}
          <Flex direction="column" gap="6" style={{ flex: "2" }}>
            {/* Pending Requests Card */}
            <Card style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "none", padding: "28px" }}>
              <Flex direction="column" gap="4">
                <Flex align="center" gap="3">
                  <Box style={{ width: "8px", height: "40px", background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)", borderRadius: "4px" }}></Box>
                  <Heading size="6">Pending Requests</Heading>
                  {requests.filter(r => r.status === "pending").length > 0 && (
                    <Box style={{ background: "#ef4444", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                      {requests.filter(r => r.status === "pending").length}
                    </Box>
                  )}
                </Flex>
                {requests.length === 0 ? (
                  <Box style={{ textAlign: "center", padding: "40px 20px" }}>
                    <Text size="5" style={{ opacity: 0.3, display: "block", marginBottom: "8px" }}>📋</Text>
                    <Text size="2" color="gray">No pending requests</Text>
                  </Box>
                ) : (
                  <Flex direction="column" gap="3">
                    {requests.map((r) => (
                      <Box key={r.wallet} style={{ background: r.status === "pending" ? "rgba(102,126,234,0.05)" : "rgba(0,0,0,0.02)", borderRadius: "12px", padding: "16px", border: r.status === "pending" ? "2px solid rgba(102,126,234,0.2)" : "1px solid rgba(0,0,0,0.05)" }}>
                        <Flex justify="between" align="center">
                          <Box style={{ flex: 1 }}>
                            <Flex align="center" gap="2" style={{ marginBottom: "8px" }}>
                              <Box style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold" }}>
                                {r.name.charAt(0).toUpperCase()}
                              </Box>
                              <Box>
                                <Text weight="bold" size="3">{r.name}</Text>
                                <Text size="1" color="gray" style={{ display: "block" }}>{r.wallet.slice(0, 10)}...{r.wallet.slice(-8)}</Text>
                              </Box>
                            </Flex>
                            <Text size="1" color="gray">{new Date(r.createdAt * 1000).toLocaleString()}</Text>
                          </Box>
                          <Flex gap="2" align="center">
                            {r.status === "pending" ? (
                              <>
                                <Button style={{ background: "#10b981", color: "#fff", borderRadius: "8px" }} onClick={() => handleApproveRequest(r.wallet, r.name)}>✓ Approve</Button>
                                <Button variant="soft" color="red" style={{ borderRadius: "8px" }} onClick={() => handleRejectRequest(r.wallet)}>✕ Reject</Button>
                              </>
                            ) : (
                              <Box style={{ padding: "8px 16px", borderRadius: "20px", background: r.status === "approved" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: r.status === "approved" ? "#10b981" : "#ef4444", fontSize: "12px", fontWeight: "600" }}>
                                {r.status === "approved" ? "✓ Approved" : "✕ Rejected"}
                              </Box>
                            )}
                          </Flex>
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                )}
              </Flex>
            </Card>

            {/* Active Providers Card */}
            <Card style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "none", padding: "28px" }}>
              <Flex direction="column" gap="4">
                <Flex align="center" gap="3" justify="between">
                  <Flex align="center" gap="3">
                    <Box style={{ width: "8px", height: "40px", background: "linear-gradient(180deg, #10b981 0%, #059669 100%)", borderRadius: "4px" }}></Box>
                    <Heading size="6">Active Providers</Heading>
                    {providers.length > 0 && (
                      <Box style={{ background: "#10b981", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                        {providers.length}
                      </Box>
                    )}
                  </Flex>
                </Flex>
                {providers.length === 0 ? (
                  <Box style={{ textAlign: "center", padding: "40px 20px" }}>
                    <Text size="5" style={{ opacity: 0.3, display: "block", marginBottom: "8px" }}>👨‍⚕️</Text>
                    <Text size="2" color="gray">No providers yet</Text>
                  </Box>
                ) : (
                  <Flex direction="column" gap="2">
                    {providers.map((p) => (
                      <Box key={p.id} style={{ background: "rgba(16,185,129,0.05)", borderRadius: "12px", padding: "16px", border: "1px solid rgba(16,185,129,0.1)" }}>
                        <Flex justify="between" align="center">
                          <Flex align="center" gap="3">
                            <Box style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "18px" }}>
                              {p.name.charAt(0).toUpperCase()}
                            </Box>
                            <Box>
                              <Text weight="bold" size="3" style={{ display: "block", marginBottom: "4px" }}>{p.name}</Text>
                              <Text size="2" color="gray" style={{ display: "block", marginBottom: "2px" }}>
                                <strong>Role:</strong> {p.role}
                              </Text>
                              <Text size="1" color="gray">{p.wallet.slice(0, 10)}...{p.wallet.slice(-8)}</Text>
                            </Box>
                          </Flex>
                          <Box style={{ padding: "8px 16px", borderRadius: "8px", background: "rgba(16,185,129,0.1)", color: "#059669", fontSize: "12px", fontWeight: "600" }}>
                            ● Online
                          </Box>
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                )}
              </Flex>
            </Card>
          </Flex>

          {/* Right Column - Quick Actions */}
          <Flex direction="column" gap="6" style={{ flex: "1", minWidth: "320px" }}>
            {/* Invite Code Card */}
            {!code ? (
              <Card style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "none", padding: "28px" }}>
                <Flex direction="column" gap="4">
                  <Heading size="5">Generate Access Code</Heading>
                  <Text size="2" color="gray">Create a code to invite providers to your company</Text>
                  <Button
                    onClick={() => {
                      setOrGenerateCompanyCode(company.id);
                      setProviderIds((prev) => [...prev]);
                    }}
                    style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff", borderRadius: "12px", padding: "16px", fontSize: "16px", fontWeight: "600" }}
                  >
                    Generate Code
                  </Button>
                </Flex>
              </Card>
            ) : (
              <Card style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(102,126,234,0.3)", border: "none", padding: "28px", color: "#fff" }}>
                <Flex direction="column" gap="3">
                  <Heading size="5" style={{ color: "#fff" }}>📱 Share Code</Heading>
                  <Text size="2" style={{ color: "rgba(255,255,255,0.8)" }}>Give this code to doctors to join your company</Text>
                  <Box style={{ background: "rgba(255,255,255,0.2)", borderRadius: "12px", padding: "20px", textAlign: "center", backdropFilter: "blur(10px)" }}>
                    <Text size="8" weight="bold" style={{ fontFamily: "monospace", letterSpacing: "8px", color: "#fff" }}>
                      {code}
                    </Text>
                  </Box>
                </Flex>
              </Card>
            )}

            {/* Add Provider Card */}
            <Card style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "none", padding: "28px" }}>
              <Flex direction="column" gap="4">
                <Heading size="5">Add Provider by ID</Heading>
                <Text size="2" color="gray">Manually link a provider NFT</Text>
                <TextField.Root 
                  value={manualProviderId} 
                  onChange={(e) => setManualProviderId(e.target.value)} 
                  placeholder="0x..." 
                  style={{ borderRadius: "12px", padding: "12px", fontSize: "14px" }}
                />
                <Button 
                  onClick={handleAddProviderById} 
                  disabled={!manualProviderId.trim()}
                  style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff", borderRadius: "12px", padding: "12px", fontWeight: "600" }}
                >
                  Add Provider
                </Button>
                {error && <Text color="red" size="2">{error}</Text>}
              </Flex>
            </Card>

            {/* Stats Card */}
            <Card style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "none", padding: "28px" }}>
              <Flex direction="column" gap="4">
                <Heading size="5">Quick Stats</Heading>
                <Flex direction="column" gap="3">
                  <Flex justify="between" align="center">
                    <Text size="2" color="gray">Total Providers</Text>
                    <Text size="5" weight="bold" style={{ color: "#10b981" }}>{providers.length}</Text>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text size="2" color="gray">Pending Requests</Text>
                    <Text size="5" weight="bold" style={{ color: "#ef4444" }}>{requests.filter(r => r.status === "pending").length}</Text>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text size="2" color="gray">Total Requests</Text>
                    <Text size="5" weight="bold">{requests.length}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
