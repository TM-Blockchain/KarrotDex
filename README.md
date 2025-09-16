# 🥕 Karrot Protocol

**Sigma Mother’s Modular DEX Aggregator + RWA Infrastructure on PulseChain**

---

## 📖 Overview

Karrot is a modular system for:

- **DEX Aggregation** across PulseX, LibertySwap, ZK P2P, and beyond 
- **pxAssets** → wrapped real-world assets bridged to Pulse 
- **Escrow Layer** → ensures cross-chain lock proofs before minting 
- **Oracle Mesh** → medianized multi-chain price feeds with chaos resistance 
- **Stabilization Vault** → mxDAI peg defense + multi-stable staking 
- **Frontend Shrine** → ritual UI with audio / NFT layers

---

## ⚙️ Core Contracts

### `KarrotMeshOracle.sol`
- Quorum-based reporting
- Median aggregation of submitted values
- Designed to tolerate chaos/outage by requiring quorum

### `KarrotEscrow.sol`
- Locks incoming RWA/pxAsset value with proof
- Emits events for off-chain relayers
- Only registered proofs unlock mint flow

### `pxAsset.sol`
- Minimal ERC20 implementation
- Mintable/Burnable only by trusted minters
- Represents wrapped RWAs (xStocks, tokenized assets, etc.)

### `pxAssetMinter.sol`
- Connected to `KarrotEscrow`
- Only Escrow can call mint() → prevents spoofed supply
- Supports multiple approved pxAssets

### `KarrotStabilizationVault.sol`
- Peg defense system for mxDAI on Pulse
- Multi-stable vault deposit + governance controls
- Circuit breaker for extreme volatility

---

## 🌐 Frontend

- **index.html** → minimal Tailwind shrine UI
- **karrot-logic.js** → web3 connection + supply fetch + contract interaction
- **voice-pack.js** → ritual audio + button interactivity

---

## 🔐 Security Layers

- **Oracle Mesh** → requires quorum submissions
- **Escrow Proof** → no mint without verified lock
- **Vault Circuit Breaker** → pause payouts during chaos
- **Anti-MEV / Replay Protections** → roadmap feature

---

## 🚀 Quickstart

### Compile
```bash
npx hardhat compile

---

## Advanced Hardening & APIs (Phase 3)

- **Oracles (v1)** now support reporter roles, quorum + median per round, and a heartbeat for staleness. New events: `ReporterAdded/Removed`, `ValueSubmitted`, `ValueFinalized`, `QuorumUpdated`, `HeartbeatUpdated`.
- **Escrow** gained bytes32 overloads (non-breaking), and emits `OracleUpdated` on config changes.
- **Aggregator** gained:
  - `swapWithControls(...)` — deadline + slippage guarded.
  - `swapWithPermit(...)` — ERC20 Permit + guarded swap in one txn.
  - Config-change events: `RouterSet`, `VenueToggled`.
- Shared libraries in `contracts/helpers`: `Errors.sol`, `OracleUtils.sol`, `PermitHelper.sol`, `Bytes32Utils.sol`.

---

## Tests (Phase 4)

- **Oracle1**: median/quorum logic, staleness reverts.
- **Escrow1**: bytes32 overload callable without revert.
- **Aggregator**: `swapWithControls` tested against `MockRouter` with ERC20Preset tokens.
- Added `contracts/MockRouter.sol` for aggregator testing.

---

## Tests Added
- **OracleV1.test.ts** — quorum/median finalization + heartbeat staleness
- **EscrowPause.test.ts** — pause/unpause gate + bytes32 overload call
- **AggregatorSwapWrappers.test.ts** — `swapWithControls` slippage/deadline checks using `MockRouter`
- **Mocks** — `MockERC20`, `MockRouter` under `contracts/mocks/`
