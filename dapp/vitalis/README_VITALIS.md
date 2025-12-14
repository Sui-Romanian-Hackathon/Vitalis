# Vitalis – Medical Beauty Clinic Platform

A Sui blockchain dApp for managing medical beauty clinics, providers (doctors), and client appointments.

## Features

- **Wallet-based authentication** via Sui Dapp Kit
- **Role-based dashboards** for companies, providers, and clients
- **On-chain appointments** stored on Sui blockchain
- **NFT-based identity** for providers and clients
- **Mocked access codes** for MVP (COMP-TEST-001, PROV-TEST-001)

## Quick Start

### Prerequisites

- Node.js 16+ & pnpm
- Sui wallet (e.g., Sui Wallet browser extension)
- Connected to **Sui Testnet**

### Installation

```bash
cd dapp/vitalis
pnpm install
```

### Development

```bash
pnpm dev
```

Visit `http://localhost:5173` and connect your wallet.

### Build

```bash
pnpm build
```

## Configuration

The package ID is hardcoded in `src/config.ts`:

```typescript
export const VITALIS_PACKAGE_ID =
  "0x00740d037ae0a91fb13ca2ef0f3342a4aeb0a353ee36bdd0dcc621bd3d08573b";
```

Update this if you re-publish the Move package.

## Test Codes (MVP)

- **Company approval codes**: `COMP-TEST-001`, `COMP-DEMO-001`
- **Provider join codes**: `PROV-TEST-001`, `PROV-DEMO-001`

## Demo Flow

1. **Connect wallet** (testnet)
2. **Register as Company** – use approval code `COMP-TEST-001`
3. **Register as Provider** – use join code `PROV-TEST-001`
4. **Register as Client** – no code needed
5. **View dashboards** per role
6. Appointment booking coming soon

## Architecture

- **Frontend**: React + TypeScript + Vite + Radix UI
- **Blockchain**: Sui Move (testnet)
- **Auth**: Wallet-based via `useVitalisAuth` hook
- **Transactions**: Signed via `useVitalisTransactions` hook

## File Structure

```
src/
  ├── config.ts                 # Package ID & mocked codes
  ├── types.ts                  # TypeScript interfaces
  ├── useVitalisAuth.ts         # Role detection hook
  ├── useVitalisTransactions.ts # Move call wrappers
  ├── App.tsx                   # Main app with routing
  └── components/
      ├── LandingPage.tsx
      ├── CompanyRegistration.tsx
      ├── ProviderRegistration.tsx
      ├── ClientRegistration.tsx
      ├── CompanyDashboard.tsx
      ├── ProviderDashboard.tsx
      └── ClientDashboard.tsx
```

## Next Steps

- Implement appointment booking UI (provider/client selection)
- Add on-chain appointment queries
- Link backend for real access code validation
- Implement email notifications
- Add provider availability calendar

---

Built for Sui Hackathon 2025.
