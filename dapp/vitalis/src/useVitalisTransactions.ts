import { useState } from "react";
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { VITALIS_MODULES, VITALIS_PACKAGE_ID } from "./config";

const COMPANY_CODE_STORAGE_KEY = "vitalis_company_codes";
const COMPANY_PROVIDERS_STORAGE_KEY = "vitalis_company_providers";
const COMPANY_PROVIDER_REQUESTS_KEY = "vitalis_company_provider_requests";

type CompanyCodeMap = Record<string, string>;

const loadCompanyCodes = (): CompanyCodeMap => {
  try {
    const raw = localStorage.getItem(COMPANY_CODE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CompanyCodeMap) : {};
  } catch {
    return {};
  }
};

const saveCompanyCode = (companyId: string, code: string) => {
  const map = loadCompanyCodes();
  map[companyId] = code;
  localStorage.setItem(COMPANY_CODE_STORAGE_KEY, JSON.stringify(map));
};

const getCompanyCode = (companyId: string): string | undefined => {
  const map = loadCompanyCodes();
  return map[companyId];
};

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const setOrGenerateCompanyCode = (companyId: string, code?: string): string => {
  const finalCode = code?.trim() || generateCode();
  saveCompanyCode(companyId, finalCode);
  return finalCode;
};

const extractCompanyId = (result: any): string | null => {
  // Try objectChanges first (more reliable)
  const changes = result?.objectChanges as any[] | undefined;
  if (changes) {
    const created = changes.find(
      (c) => c?.type === "created" && typeof c.objectType === "string" && c.objectType.includes("vitalis_company::CompanyProfile")
    );
    if (created?.objectId) return created.objectId;
  }

  // Fallback to effects.created
  const createdEffects = result?.effects?.created as any[] | undefined;
  if (createdEffects) {
    const match = createdEffects.find((c) => typeof c.owner?.objectType === "string" && c.owner.objectType.includes("vitalis_company::CompanyProfile"));
    if (match?.reference?.objectId) return match.reference.objectId;
  }

  return null;
};

const extractProviderId = (result: any): string | null => {
  const changes = result?.objectChanges as any[] | undefined;
  if (changes) {
    const created = changes.find(
      (c) => c?.type === "created" && typeof c.objectType === "string" && c.objectType.includes("vitalis_identity::ProviderNFT")
    );
    if (created?.objectId) return created.objectId;
  }
  const createdEffects = result?.effects?.created as any[] | undefined;
  if (createdEffects) {
    const match = createdEffects.find((c) => typeof c.owner?.objectType === "string" && c.owner.objectType.includes("vitalis_identity::ProviderNFT"));
    if (match?.reference?.objectId) return match.reference.objectId;
  }
  return null;
};

const extractClientId = (result: any): string | null => {
  // Log entire result for debugging
  console.log("Full transaction result:", result);
  
  const changes = result?.objectChanges as any[] | undefined;
  if (changes) {
    console.log("objectChanges found:", changes);
    const created = changes.find(
      (c) =>
        c?.type === "created" &&
        typeof c.objectType === "string" &&
        c.objectType.includes("vitalis_identity::ClientNFT")
    );
    if (created?.objectId) {
      console.log("Found ClientNFT in objectChanges:", created.objectId);
      return created.objectId;
    }
  }

  const createdEffects = result?.effects?.created as any[] | undefined;
  if (createdEffects) {
    console.log("effects.created found:", createdEffects);
    const match = createdEffects.find(
      (c) => typeof c.owner?.objectType === "string" && c.owner.objectType.includes("vitalis_identity::ClientNFT")
    );
    if (match?.reference?.objectId) {
      console.log("Found ClientNFT in effects.created:", match.reference.objectId);
      return match.reference.objectId;
    }
  }

  console.log("Could not extract ClientNFT ID from result");
  return null;
};

const extractAppointmentId = (result: any): string | null => {
  const changes = result?.objectChanges as any[] | undefined;
  if (changes) {
    const created = changes.find(
      (c) =>
        c?.type === "created" &&
        typeof c.objectType === "string" &&
        (c.objectType.includes("vitalis_appointments::Appointment") || c.objectType.includes("vitalis_appointments::LightAppointment"))
    );
    if (created?.objectId) return created.objectId;
  }

  const createdEffects = result?.effects?.created as any[] | undefined;
  if (createdEffects) {
    const match = createdEffects.find(
      (c) =>
        typeof c.owner?.objectType === "string" &&
        (c.owner.objectType.includes("vitalis_appointments::Appointment") || c.owner.objectType.includes("vitalis_appointments::LightAppointment"))
    );
    if (match?.reference?.objectId) return match.reference.objectId;
  }

  return null;
};

type ProviderMap = Record<string, string[]>; // companyId -> [providerId]

const loadCompanyProviders = (): ProviderMap => {
  try {
    const raw = localStorage.getItem(COMPANY_PROVIDERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProviderMap) : {};
  } catch {
    return {};
  }
};

const saveProviderForCompany = (companyId: string, providerId: string) => {
  const map = loadCompanyProviders();
  const list = new Set(map[companyId] || []);
  list.add(providerId);
  map[companyId] = Array.from(list);
  localStorage.setItem(COMPANY_PROVIDERS_STORAGE_KEY, JSON.stringify(map));
};

const getProvidersForCompany = (companyId: string): string[] => {
  const map = loadCompanyProviders();
  return map[companyId] || [];
};

type ProviderRequest = {
  wallet: string;
  name: string;
  createdAt: number;
  status: "pending" | "approved" | "rejected";
};

type ProviderRequestsMap = Record<string, ProviderRequest[]>; // companyId -> requests

const loadProviderRequests = (): ProviderRequestsMap => {
  try {
    const raw = localStorage.getItem(COMPANY_PROVIDER_REQUESTS_KEY);
    return raw ? (JSON.parse(raw) as ProviderRequestsMap) : {};
  } catch {
    return {};
  }
};

const saveProviderRequests = (map: ProviderRequestsMap) => {
  localStorage.setItem(COMPANY_PROVIDER_REQUESTS_KEY, JSON.stringify(map));
};

const addProviderRequest = (companyId: string, wallet: string, name: string) => {
  const map = loadProviderRequests();
  const list = map[companyId] || [];
  const existingIdx = list.findIndex((r) => r.wallet === wallet);
  const entry: ProviderRequest = {
    wallet,
    name,
    createdAt: Math.floor(Date.now() / 1000),
    status: "pending",
  };
  if (existingIdx >= 0) {
    list[existingIdx] = entry;
  } else {
    list.push(entry);
  }
  map[companyId] = list;
  saveProviderRequests(map);
  return entry;
};

const getProviderRequests = (companyId: string): ProviderRequest[] => {
  const map = loadProviderRequests();
  return map[companyId] || [];
};

const setProviderRequestStatus = (companyId: string, wallet: string, status: "approved" | "rejected") => {
  const map = loadProviderRequests();
  const list = map[companyId] || [];
  const idx = list.findIndex((r) => r.wallet === wallet);
  if (idx >= 0) {
    list[idx].status = status;
    map[companyId] = list;
    saveProviderRequests(map);
    return list[idx];
  }
  return null;
};

const getCompanyIdByAccessCode = (accessCode: string): string | undefined => {
  const codes = loadCompanyCodes();
  return Object.entries(codes).find(([_, code]) => code === accessCode.trim())?.[0];
};

type CompanyNameMap = Record<string, string>;

const loadCompanyNames = (): CompanyNameMap => {
  try {
    const raw = localStorage.getItem("vitalis_company_names");
    return raw ? (JSON.parse(raw) as CompanyNameMap) : {};
  } catch {
    return {};
  }
};

const saveCompanyName = (companyId: string, name: string) => {
  const map = loadCompanyNames();
  map[companyId] = name;
  localStorage.setItem("vitalis_company_names", JSON.stringify(map));
};

const saveProvidersForCompanyStorage = (companyId: string, providers: Array<{ id: string; name: string; role: string; wallet: string }>) => {
  localStorage.setItem(`vitalis_providers_${companyId}`, JSON.stringify(providers));
};

/**
 * Hook for executing Vitalis Move functions
 */
export function useVitalisTransactions() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [txInProgress, setTxInProgress] = useState(false);

  const executeTransaction = async (tx: Transaction) => {
    setTxInProgress(true);
    try {
      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              setTxInProgress(false);
              resolve(result);
            },
            onError: (error) => {
              setTxInProgress(false);
              reject(error);
            },
          }
        );
      });
    } catch (err) {
      setTxInProgress(false);
      throw err;
    }
  };

  const createCompany = async (name: string) => {
    const code = generateCode();

    const tx = new Transaction();
    tx.moveCall({
      target: `${VITALIS_MODULES.company}::create_company`,
      arguments: [
        tx.pure.string(name),
        tx.pure.u64(Math.floor(Date.now() / 1000)),
      ],
    });

    const result = await executeTransaction(tx);
    const companyId = extractCompanyId(result);
    if (companyId) {
      saveCompanyCode(companyId, code);
      saveCompanyName(companyId, name);
    }

    return { result, companyId, code };
  };

  const mintProviderNFT = async (
    _name: string,
    accessCode: string
  ) => {
    if (!account?.address) throw new Error("Wallet not connected");

    const approvals = await client.getOwnedObjects({
      owner: account.address,
      filter: { StructType: `${VITALIS_PACKAGE_ID}::vitalis_identity::ProviderApproval` },
      options: { showType: true, showContent: true },
    });

    let targetApproval: any = null;
    let companyIdFromApproval: string | undefined = undefined;

    if (accessCode && accessCode.trim().length > 0) {
      const companyId = getCompanyIdByAccessCode(accessCode);
      if (!companyId) throw new Error("Invalid company access code");
      targetApproval = approvals.data.find((obj: any) => {
        const fields: any = (obj?.data?.content as any)?.fields || {};
        return String(fields.company_id) === companyId;
      });
      companyIdFromApproval = companyId;
    } else {
      // pick first approval available
      targetApproval = approvals.data[0];
      if (targetApproval) {
        const fields: any = (targetApproval?.data?.content as any)?.fields || {};
        companyIdFromApproval = String(fields.company_id);
      }
    }

    if (!targetApproval?.data?.objectId) {
      throw new Error("No approval found from company. Please wait until the company approves your request.");
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${VITALIS_MODULES.identity}::mint_provider_nft`,
      arguments: [
        tx.pure.string("Provider"),
        tx.object(targetApproval.data.objectId),
        tx.pure.u64(Math.floor(Date.now() / 1000)),
      ],
    });

    const result = await executeTransaction(tx);
    const providerId = extractProviderId(result);
    if (providerId && companyIdFromApproval) {
      saveProviderForCompany(companyIdFromApproval, providerId);
      
      // Also save provider data to localStorage
      const existingProviders: Array<{ id: string; name: string; role: string; wallet: string }> = [];
      try {
        const stored = localStorage.getItem(`vitalis_providers_${companyIdFromApproval}`);
        if (stored) {
          existingProviders.push(...JSON.parse(stored));
        }
      } catch (e) {
        // ignore
      }
      
      if (account?.address) {
        existingProviders.push({
          id: providerId,
          name: _name || "Provider",
          role: "Provider",
          wallet: account.address,
        });
        saveProvidersForCompanyStorage(companyIdFromApproval, existingProviders);
      }
    }
    return { result, providerId };
  };
  const issueProviderApproval = async (companyId: string, providerWallet: string, providerName: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${VITALIS_MODULES.identity}::issue_provider_approval`,
      arguments: [
        tx.object(companyId),
        tx.pure.address(providerWallet as any),
        tx.pure.string(providerName),
        tx.pure.u64(Math.floor(Date.now() / 1000)),
      ],
    });
    return executeTransaction(tx);
  };

  const mintClientNFT = async (displayName: string) => {
    if (!account) throw new Error("Wallet not connected");
    
    const tx = new Transaction();
    const displayNameBytes = Array.from(new TextEncoder().encode(displayName));
    tx.moveCall({
      target: `${VITALIS_MODULES.identity}::mint_client_nft`,
      arguments: [
        tx.pure.vector('u8', displayNameBytes),
        tx.pure.u64(Math.floor(Date.now() / 1000)),
      ],
    });

    const result = await executeTransaction(tx);
    console.log("Transaction succeeded with digest:", (result as any)?.digest);
    
    // Query the blockchain to find the created ClientNFT
    let clientId: string | null = null;
    try {
      // Wait a moment for the transaction to be indexed
      await new Promise(r => setTimeout(r, 1000));
      
      const objects = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${VITALIS_MODULES.identity}::ClientNFT`,
        },
      });
      
      if (objects.data && objects.data.length > 0) {
        // Get the most recently created one
        clientId = objects.data[objects.data.length - 1].data?.objectId || null;
        console.log("Found ClientNFT object ID:", clientId);
      }
    } catch (err) {
      console.error("Error querying for ClientNFT:", err);
    }
    
    if (!clientId) {
      console.error("Failed to extract clientId from transaction result:", result);
      throw new Error("Failed to create identity NFT - could not extract NFT ID from transaction");
    }
    return { result, clientId };
  };

  const createAppointmentLight = async (
    clientId: string,
    providerName: string,
    startTime: number,
    endTime: number
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${VITALIS_MODULES.appointments}::create_appointment_light`,
      arguments: [
        tx.object(clientId),
        tx.pure.string(providerName),
        tx.pure.u64(startTime),
        tx.pure.u64(endTime),
        tx.pure.u64(Math.floor(Date.now() / 1000)),
      ],
    });

    const result = await executeTransaction(tx);
    const appointmentId = extractAppointmentId(result);
    return { result, appointmentId };
  };

  const cancelAppointment = async (clientId: string, appointmentId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${VITALIS_MODULES.appointments}::cancel_appointment_light`,
      arguments: [tx.object(clientId), tx.object(appointmentId)],
    });

    return executeTransaction(tx);
  };

  const completeAppointment = async (
    providerId: string,
    appointmentId: string
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${VITALIS_MODULES.appointments}::complete_appointment`,
      arguments: [tx.object(providerId), tx.object(appointmentId)],
    });

    return executeTransaction(tx);
  };

  const getAllCompaniesWithProviders = async () => {
    // Just read from localStorage - no blockchain calls needed
    const companyCodes = loadCompanyCodes();
    const companies: Array<{
      id: string;
      name: string;
      providers: Array<{ id: string; name: string; role: string; wallet: string }>;
    }> = [];

    // Create a map to store company names by ID
    const companyNameMap: Record<string, string> = {};
    
    // Parse company names from storage if available
    try {
      const storedNames = localStorage.getItem("vitalis_company_names");
      if (storedNames) {
        Object.assign(companyNameMap, JSON.parse(storedNames));
      }
    } catch (e) {
      // ignore
    }

    // Get all company IDs
    const companyIds = Object.keys(companyCodes);

    for (const companyId of companyIds) {
      const companyName = companyNameMap[companyId] || "Unknown Company";
      const providers: Array<{ id: string; name: string; role: string; wallet: string }> = [];

      // Parse provider storage if available
      try {
        const storedProviders = localStorage.getItem(`vitalis_providers_${companyId}`);
        if (storedProviders) {
          const parsed = JSON.parse(storedProviders);
          if (Array.isArray(parsed)) {
            providers.push(...parsed);
          }
        }
      } catch (e) {
        // ignore
      }

      companies.push({
        id: companyId,
        name: companyName,
        providers,
      });
    }

    return companies;
  };

  const createReservation = async (reservationData: {
    clientId: string;
    providerName?: string;
    timeSlot: string;
    date: string;
    durationMinutes?: number;
  }) => {
    const startTime = Math.floor(new Date(`${reservationData.date} ${reservationData.timeSlot}`).getTime() / 1000);
    const endTime = startTime + ((reservationData.durationMinutes || 60) * 60);

    const { result, appointmentId } = await createAppointmentLight(
      reservationData.clientId,
      reservationData.providerName || "Provider",
      startTime,
      endTime
    );

    return { result, appointmentId };
  };

  return {
    createCompany,
    mintProviderNFT,
    mintClientNFT,
    createAppointment: createAppointmentLight,
    createReservation,
    cancelAppointment,
    completeAppointment,
    txInProgress,
    getCompanyCode,
    setOrGenerateCompanyCode,
    getProvidersForCompany,
    getAllCompaniesWithProviders,
    // Requests
    addProviderRequest,
    getProviderRequests,
    setProviderRequestStatus,
    getCompanyIdByAccessCode,
    issueProviderApproval,
  };
}
