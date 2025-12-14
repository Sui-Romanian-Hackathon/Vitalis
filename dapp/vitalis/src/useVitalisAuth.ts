import {
  useCurrentAccount,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import {
  CompanyProfile,
  ProviderNFT,
  ClientNFT,
  UserRole,
} from "./types";
import { VITALIS_PACKAGE_ID } from "./config";

/**
 * Parse an object's fields from SuiObjectData
 */
function parseObjectFields(obj: any): Record<string, any> {
  if (!obj?.data?.content) return {};
  if (obj.data.content.dataType === "moveObject") {
    return obj.data.content.fields || {};
  }
  return {};
}

/**
 * Check if object is a CompanyProfile from the current package
 */
function isCompanyProfile(obj: any): obj is CompanyProfile {
  const fields = parseObjectFields(obj);
  const expectedType = `${VITALIS_PACKAGE_ID}::vitalis_company::CompanyProfile`;
  return (
    obj.data?.type === expectedType &&
    typeof fields.name === "string" &&
    typeof fields.owner === "string"
  );
}

/**
 * Check if object is a CompanyAdminCap from the current package
 */
function isCompanyAdminCap(obj: any): boolean {
  const expectedType = `${VITALIS_PACKAGE_ID}::vitalis_company::CompanyAdminCap`;
  return obj.data?.type === expectedType;
}

/**
 * Check if object is a ProviderNFT from the current package
 */
function isProviderNFT(obj: any): obj is ProviderNFT {
  const fields = parseObjectFields(obj);
  const expectedType = `${VITALIS_PACKAGE_ID}::vitalis_identity::ProviderNFT`;
  return (
    obj.data?.type === expectedType &&
    typeof fields.name === "string" &&
    typeof fields.company_id === "string"
  );
}

/**
 * Check if object is a ClientNFT from the current package
 */
function isClientNFT(obj: any): obj is ClientNFT {
  const fields = parseObjectFields(obj);
  const expectedType = `${VITALIS_PACKAGE_ID}::vitalis_identity::ClientNFT`;
  return (
    obj.data?.type === expectedType &&
    typeof fields.wallet === "string"
  );
}

/**
 * Hook to detect user role and fetch their on-chain objects
 */
export function useVitalisAuth() {
  const account = useCurrentAccount();
  const { data, isLoading, error, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      options: {
        showType: true,
        showContent: true,
        showOwner: true,
      },
      // Sui fullnode enforces max page size 50; larger will error and return nothing
      limit: 50,
    },
    {
      enabled: !!account?.address,
      staleTime: 0,
    }
  );

  // Query for all objects to find CompanyProfile (shared objects won't show in getOwnedObjects)
  // We filter client-side instead of using StructType filter
  const { data: allObjectsData, isLoading: allObjectsLoading, refetch: refetchAllObjects } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      options: {
        showType: true,
        showContent: true,
        showOwner: true,
      },
      limit: 100,
    },
    {
      enabled: !!account?.address,
      staleTime: 0,
    }
  );

  const ownedObjects = data?.data || [];
  // Filter all objects for CompanyProfile type
  const allObjects = allObjectsData?.data || [];
  const sharedObjects = allObjects.filter(obj => {
    const type = obj.data?.type || "";
    return type.includes("vitalis_company::CompanyProfile");
  });

  console.log("useVitalisAuth state:", {
    address: account?.address,
    loading: isLoading,
    error: error?.message,
    objects: ownedObjects.length,
    types: ownedObjects.map((obj) => obj.data?.type),
  });

  ownedObjects.forEach((obj, idx) => {
    const type = obj.data?.type || "";
    if (
      type.includes("vitalis_identity::ClientNFT") ||
      type.includes("vitalis_identity::ProviderNFT") ||
      type.includes("vitalis_company::CompanyProfile")
    ) {
      const content: any = obj.data?.content as any;
      console.log("[Vitalis obj]", idx, type, content?.fields || content);
    }
  });

  // Detect role from owned objects (using flexible type matching)
  const detectRole = (): UserRole | null => {
    if (!data?.data) return null;
    
    console.log("Checking owned objects:", data.data.map(obj => obj.data?.type));
    
    for (const obj of data.data) {
      const type = obj.data?.type || "";
      console.log("Checking object type:", type);
      
      // Check for CompanyAdminCap (company role) - use flexible matching
      if (type.includes("::vitalis_company::CompanyAdminCap")) {
        console.log("✓ Found CompanyAdminCap");
        return "company";
      }
      if (type.includes("::vitalis_identity::ProviderNFT")) {
        console.log("✓ Found ProviderNFT");
        return "provider";
      }
      if (type.includes("::vitalis_identity::ClientNFT")) {
        console.log("✓ Found ClientNFT");
        return "client";
      }
    }
    
    // Check all objects for CompanyProfile (company role detection)
    // CompanyProfile is a shared object but appears in owned objects
    if (ownedObjects && ownedObjects.length > 0) {
      for (const obj of ownedObjects) {
        const type = obj.data?.type || "";
        if (type.includes("::vitalis_company::CompanyProfile")) {
          const content: any = obj.data?.content as any;
          const fields: any = content?.fields || {};
          if (fields.owner === account?.address) {
            console.log("✓ Found CompanyProfile where user is owner");
            return "company";
          }
        }
      }
    }
    
    console.log("No Vitalis objects found");
    return null;
  };

  // Extract company profile where user is the owner
  const getCompany = (): CompanyProfile | undefined => {
    if (!ownedObjects || ownedObjects.length === 0) return undefined;
    
    for (const obj of ownedObjects) {
      const type = obj.data?.type || "";
      if (type.includes("::vitalis_company::CompanyProfile")) {
        const content: any = obj.data?.content as any;
        const fields: any = content?.fields || {};
        
        // Only return the company if the current user is the owner
        if (fields.owner === account?.address) {
          const created_at_raw = fields.created_at;
          const status_raw = fields.status;
          return {
            id: obj.data?.objectId || "",
            name: fields.name || "",
            owner: fields.owner || "",
            created_at: typeof created_at_raw === "string" ? parseInt(created_at_raw) : Number(created_at_raw) || 0,
            status: typeof status_raw === "string" ? parseInt(status_raw) : Number(status_raw) || 0,
          };
        }
      }
    }
    return undefined;
  };

  // Extract provider NFT
  const getProvider = (): ProviderNFT | undefined => {
    if (!data?.data) return undefined;
    for (const obj of data.data) {
      const type = obj.data?.type || "";
      // Use flexible type matching like detectRole
      if (type.includes("::vitalis_identity::ProviderNFT")) {
        const content: any = obj.data?.content as any;
        const fields: any = content?.fields || {};
        return {
          id: obj.data?.objectId || "",
          name: fields.name || "",
          company_id: fields.company_id || "",
          wallet: fields.wallet || "",
          role: fields.role || "",
          active: fields.active === true,
          created_at: parseInt(fields.created_at) || 0,
        };
      }
    }
    return undefined;
  };

  // Extract client NFT
  const getClient = (): ClientNFT | undefined => {
    if (!data?.data) return undefined;
    for (const obj of data.data) {
      const type = obj.data?.type || "";
      // Use flexible type matching like detectRole
      if (type.includes("::vitalis_identity::ClientNFT")) {
        const content: any = obj.data?.content as any;
        const fields: any = content?.fields || {};
        return {
          id: obj.data?.objectId || "",
          wallet: fields.wallet || "",
          display_name: fields.display_name || "",
          email: fields.email || "",
          created_at: parseInt(fields.created_at) || 0,
        };
      }
    }
    return undefined;
  };

  const role = detectRole();
  const company = getCompany();
  const provider = getProvider();
  const client = getClient();

  console.log("detected role snapshot", {
    role,
    company: company?.id,
    provider: provider?.id,
    client: client?.id,
  });

  return {
    address: account?.address || null,
    role,
    company,
    provider,
    client,
    loading: isLoading || allObjectsLoading,
    error: error?.message || null,
    refetch: () => {
      refetch?.();
      refetchAllObjects?.();
    },
  };
}
