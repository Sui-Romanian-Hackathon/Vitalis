// On-chain package and network configuration
export const VITALIS_PACKAGE_ID =
  "0x1e31d3c6886eb6859dd36f40de17b3b0d64a1ed145a1e514b01cabedf276f3cb";

export const VITALIS_MODULES = {
  company: `${VITALIS_PACKAGE_ID}::vitalis_company`,
  identity: `${VITALIS_PACKAGE_ID}::vitalis_identity`,
  appointments: `${VITALIS_PACKAGE_ID}::vitalis_appointments`,
};

// Status constants
export const APPOINTMENT_STATUS = {
  BOOKED: 0,
  COMPLETED: 1,
  CANCELLED: 2,
};

export const STATUS_LABELS: Record<number, string> = {
  0: "Booked",
  1: "Completed",
  2: "Cancelled",
};

// Universal access code (MVP - same for company and provider registration)
export const UNIVERSAL_ACCESS_CODE = "VITALIS-001";
