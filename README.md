# DAO Governance Platform (VETO)

A production-ready, enterprise-grade, audit-ready DAO Governance Platform similar to Snapshot, Aragon, Tally, and Compound Governance. The monorepo incorporates smart contracts, a NestJS backend (PostgreSQL + Prisma + Redis), and a Next.js 15 frontend (Tailwind CSS + Wagmi/Viem + Framer Motion).

## Architecture Overview

```
                        +----------------------------+
                        |     Next.js 15 Frontend    |
                        |   (Wagmi, Viem, React)     |
                        +--------------+-------------+
                                       |
                   SIWE Challenge      |  EIP-712 Signed Votes
                   & JWT Verification  |  & Discussions REST/WebSockets
                                       v
                        +--------------+-------------+
                        |     NestJS Backend API     |
                        +--------+----------+--------+
                                 |          |
                           Prisma|     Redis|Events/Sockets
                                 v          v
                        +--------+--+  +----+--------+
                        | PostgreSQL|  | WebSocket   |
                        | Database  |  | Gateway     |
                        +-----------+  +-------------+
```

### Components
1. **`contracts/`**: Hardhat project hosting OpenZeppelin Governor v5 standards, customized token vaults, timelocks, ve-staking, and M-of-N multi-signature treasuries.
2. **`backend/`**: NestJS application facilitating SIWE (Sign-In with Ethereum) authentication, EIP-712 off-chain signature verified votes database persistence, AI-driven proposal audits, and Socket.io gateway notifications.
3. **`frontend/`**: Next.js 15 dashboard styled with glassmorphism components, charting vote outcomes, interactive staking locks, and multisig queue actions.

---

## Directory Layout
```
├── .github/workflows/   # CI/CD pipelines
├── contracts/           # Smart contracts, tests, Hardhat config
│   ├── contracts/       # Solidity files
│   └── test/            # Ethers compilation tests
├── backend/             # NestJS API & database client
│   ├── src/             # SIWE, AI, DAO, Proposals services
│   └── prisma/          # Prisma database schema
├── frontend/            # Next.js 15 web dashboard
└── docker-compose.yml   # Global container setups
```

---

## Quickstart Guide

### 1. Prerequisite Infrastructure
Ensure you have Docker and Node.js (v20+) installed. Spin up PostgreSQL and Redis:
```bash
docker-compose up -d postgres redis
```

### 2. Smart Contracts Setup & Tests
Compile Solidity contracts and execute the Hardhat test suite:
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```
*Note: All core tests (proposal delegation, timelocks, ve-staking locks, multi-sig execution) compile and verify successfully on simulated Cancun EVM targets.*

### 3. Backend Setup
Synchronize database models and start the NestJS API:
```bash
cd ../backend
npm install
npx prisma generate
npm run start:dev
```
The server will boot on [http://localhost:3001](http://localhost:3001).

### 4. Frontend Setup
Start the local Next.js dev server:
```bash
cd ../frontend
npm install --legacy-peer-deps
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the explorer and connect your MetaMask.

---

## Technical Specifications

### EIP-712 Off-Chain Voting Schema
To facilitate secure, gasless off-chain signature voting, users sign structured payloads defined as:

- **Domain**:
  ```typescript
  const domain = {
    name: 'DAO Governance Platform',
    version: '1',
    chainId: 1, // Target chain
    verifyingContract: governorAddress,
  };
  ```
- **Type Definitions**:
  ```typescript
  const types = {
    Vote: [
      { name: 'voter', type: 'address' },
      { name: 'proposalId', type: 'string' },
      { name: 'choice', type: 'string' },
      { name: 'weight', type: 'uint256' },
    ],
  };
  ```

---

## Audit-Ready Smart Contracts Checklist
- [x] **OpenZeppelin Governor v5** for standard compatibility.
- [x] **ReentrancyGuard** in Treasury, Staking, and MultiSig wallets to shield against withdrawal exploits.
- [x] **Access Control** configurations via Timelock Controller ensuring ONLY proposals passing voting thresholds can touch assets.
- [x] **Timelock execution delays** acting as defensive circuit-breakers against hostile proposal acquisitions.
