Turbin3 Q1 2026 Builders Cohort

This repository contains all Solana programs developed during the Turbin3 Q1 2026 Builders Cohort. It showcases multiple production-grade on-chain programs built using the Anchor framework, covering DeFi primitives, governance mechanisms, staking systems, and cryptographic proofs.

All major programs have successfully passed their respective tests.

About

This repository represents hands-on implementation of advanced Solana development concepts including:

On-chain program architecture

Account validation and state management

Token operations (SPL & NFTs)

Governance mechanisms

Automated Market Makers (AMM)

Program Derived Addresses (PDAs)

Secure transaction flows

Cross-Program Invocations (CPIs)

Anchor-based testing workflows

Each folder is an independent Anchor project.

Repository Structure
anchor-amm

Automated Market Maker implementation.

Features:

Liquidity pool initialization

Token swaps

Liquidity provision & removal

Constant product formula logic

PDA-based vault management

Status: All tests passing

anchor-dice-game

On-chain provably fair dice game.

Features:

Randomized dice outcome logic

Player betting system

Reward distribution

Secure escrowed bets

Status: Tests passed

anchor-mplxcore

Metaplex Core integration program.

Features:

NFT-based interactions

Metadata handling

Token validation logic

Anchor + Metaplex interoperability

Status: Tests passed

anchor-quadratic-voting

Quadratic voting governance implementation (quad-dao).

Features:

Proposal creation

Vote weight = square root logic

Token-based voting power

Governance state management

Status: Tests passed

anchor_escrow

Peer-to-peer escrow smart contract.

Features:

Escrow initialization

Token locking mechanism

Secure trade execution

Refund handling

PDA-based authority control

Status: Initial implementation complete

nft-staking

NFT staking protocol with rewards logic.

Features:

NFT deposit & withdrawal

Reward accrual mechanism

Staking duration tracking

Secure NFT custody

Status: Active development (merge conflicts resolved)

proofs

Cryptographic proof-related program.

Features:

Verification logic

Governance-linked proof validation

Secure instruction handling

Status: Tests passed

vault-solana

Secure SOL/token vault implementation.

Features:

Controlled deposits

Authorized withdrawals

Owner validation

Vault state management

Status: Active development (merge conflicts resolved)

Technologies Used

Solana Blockchain

Rust

Anchor Framework

TypeScript (for testing)

SPL Token Program

Metaplex (MPL Core)

Getting Started
Prerequisites

Rust (latest stable)

Solana CLI

Anchor (v0.29.0+ recommended)

Node.js (v18+)

Yarn or npm

Clone Repository
git clone https://github.com/Abhist17/q1_26_turbin3.git
cd q1_26_turbin3

Install Dependencies (Per Project)

Example:

cd anchor-amm
npm install


Repeat for any project directory.

Build Program
anchor build

Run Tests
anchor test


All major programs currently have passing test suites.

Deploy to Devnet
solana config set --url devnet
anchor deploy

Core Competencies Demonstrated

Advanced Anchor macros & constraints

PDA derivation & authority management

Token program interactions

CPI (Cross Program Invocation)

Governance & quadratic voting logic

AMM mathematical modeling

NFT staking systems

Secure escrow mechanics

Test-driven smart contract development

Merge conflict resolution in multi-program repositories

Learning Outcome

This repository reflects end-to-end proficiency in:

Solana smart contract engineering

Secure on-chain state transitions

DeFi primitive implementation

Governance protocol design

Blockchain testing & debugging workflows

Resources

Solana Documentation

Anchor Documentation

Metaplex Documentation

Acknowledgment

Built during Turbin3 Q1 2026 Builders Cohort.

All major programs successfully tested and validated.
