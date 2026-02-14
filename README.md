# Turbin3 Q1 2026 Builders Cohort

This repository contains all Solana programs developed during the **Turbin3 Q1 2026 Builders Cohort**. It showcases production-ready on-chain programs built using the Anchor framework, covering DeFi primitives, governance mechanisms, staking protocols, vault systems, and cryptographic proof verification.

All major programs have successfully passed their respective test suites.

---

## Overview

This repository demonstrates practical implementation of:

* Solana program architecture
* Secure account validation
* Program Derived Addresses (PDAs)
* Cross Program Invocations (CPIs)
* SPL token interactions
* NFT-based logic
* Automated Market Maker (AMM) design
* Quadratic voting governance
* On-chain staking mechanisms
* Anchor-based testing workflows

Each folder represents an independent Anchor project.

---

## Repository Structure

### 1. anchor-amm

Automated Market Maker implementation.

**Features**

* Liquidity pool initialization
* Token swaps using constant product formula
* Liquidity addition and removal
* Vault management via PDAs

**Status:** All tests passing

---

### 2. anchor-dice-game

Provably fair on-chain dice game.

**Features**

* Secure betting mechanism
* Randomized dice logic
* Reward distribution
* Escrowed bet handling

**Status:** Tests passed

---

### 3. anchor-mplxcore

Metaplex Core integration program.

**Features**

* NFT metadata interactions
* Token validation
* Anchor + Metaplex interoperability

**Status:** Tests passed

---

### 4. anchor-quadratic-voting

Quadratic voting governance implementation (Quad DAO).

**Features**

* Proposal creation
* Vote weight using square root logic
* Token-based governance
* On-chain vote tracking

**Status:** Tests passed

---

### 5. anchor_escrow

Peer-to-peer escrow smart contract.

**Features**

* Escrow initialization
* Token locking
* Secure exchange execution
* Refund mechanism
* PDA authority control

**Status:** Initial implementation complete

---

### 6. nft-staking

NFT staking protocol with rewards logic.

**Features**

* NFT deposit and withdrawal
* Reward accrual system
* Stake duration tracking
* Secure NFT custody

**Status:** Active development

---

### 7. proofs

Cryptographic proof verification program.

**Features**

* On-chain proof validation
* Secure instruction handling
* Governance-linked verification logic

**Status:** Tests passed

---

### 8. vault-solana

Secure vault implementation for SOL and tokens.

**Features**

* Controlled deposits
* Authorized withdrawals
* Owner-based access control
* Secure state management

**Status:** Active development

---

## Technologies Used

* Solana Blockchain
* Rust
* Anchor Framework
* TypeScript (testing)
* SPL Token Program
* Metaplex Core

---

## Getting Started

### Prerequisites

* Rust (latest stable)
* Solana CLI
* Anchor (v0.29.0 or higher recommended)
* Node.js (v18+)
* npm or yarn

---

### Clone the Repository

```bash
git clone https://github.com/Abhist17/q1_26_turbin3.git
cd q1_26_turbin3
```

---

### Install Dependencies (Per Project)

```bash
cd <project-folder>
npm install
```

Example:

```bash
cd anchor-amm
npm install
```

---

### Build a Program

```bash
anchor build
```

---

### Run Tests

```bash
anchor test
```

All major programs currently have passing test suites.

---

### Deploy to Devnet

```bash
solana config set --url devnet
anchor deploy
```

---

## Core Competencies Demonstrated

* Advanced Anchor account constraints
* PDA derivation and authority management
* SPL token interactions
* Cross Program Invocation (CPI)
* AMM mathematical modeling
* Quadratic voting governance logic
* NFT staking systems
* Escrow contract architecture
* Secure vault design
* Test-driven smart contract development

---

## Learning Outcomes

This repository reflects strong proficiency in:

* Solana smart contract engineering
* Secure on-chain state transitions
* DeFi primitive implementation
* Governance protocol development
* Blockchain debugging and testing workflows

---

## Acknowledgment

Built during the Turbin3 Q1 2026 Builders Cohort.

All major modules have been successfully implemented and tested.

---
