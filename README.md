# Turbin3 Q1 2026 Builders Cohort

This repository contains all the Solana programs and projects developed during the Turbin3 Q1 2026 Builders Cohort. The repository showcases various on-chain programs built using the Anchor framework, demonstrating Solana smart contract development skills and best practices.

## About

This collection represents hands-on learning and implementation of Solana blockchain development concepts, including program architecture, state management, token operations, and secure transaction handling. Each project demonstrates different aspects of Solana development using Rust and the Anchor framework.

## Repository Structure

### anchor_escrow
An escrow program implementation that enables secure peer-to-peer transactions on the Solana blockchain. This program demonstrates:
- Escrow account creation and management
- Token transfers between parties
- Secure state transitions
- Program-derived addresses (PDAs)

### nft-staking
A comprehensive NFT staking program that allows users to stake their NFTs and earn rewards. Features include:
- NFT deposit and withdrawal mechanisms
- Staking rewards calculation
- User account management
- Stake tracking and validation

### vault-solana
A secure vault implementation for managing digital assets on Solana. This program covers:
- Vault initialization and configuration
- Deposit and withdrawal functionality
- Account security best practices
- SOL and token management

## Technologies Used

- **Solana** - High-performance blockchain for decentralized applications
- **Rust** - Primary programming language for Solana smart contracts
- **Anchor Framework** - Development framework simplifying Solana program creation
- **TypeScript** - Used for testing and client interactions

## Getting Started

### Prerequisites

- Rust (latest stable version)
- Solana CLI tools
- Anchor Framework (v0.29.0 or higher)
- Node.js and npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Abhist17/q1_26_turbin3.git
cd q1_26_turbin3
```

2. Install dependencies for each project:
```bash
cd anchor_escrow
npm install

cd ../nft-staking
npm install

cd ../vault-solana
npm install
```

### Building Programs

To build any of the programs:

```bash
cd <program-directory>
anchor build
```

### Testing

Run tests for each program:

```bash
anchor test
```

### Deployment

To deploy to devnet:

1. Configure Solana CLI to devnet:
```bash
solana config set --url devnet
```

2. Deploy the program:
```bash
anchor deploy
```

## Program Features

### Anchor Escrow
- Maker creates escrow with offered tokens
- Taker can accept the escrow and exchange tokens
- Escrow can be refunded if not accepted
- Secure token handling with associated token accounts

### NFT Staking
- Users can stake NFTs to earn rewards
- Flexible staking periods
- Automatic reward calculation
- Safe NFT custody and return

### Vault Solana
- Secure SOL storage
- Controlled deposit and withdrawal operations
- Owner-based access control
- Efficient state management

## Learning Outcomes

This repository demonstrates proficiency in:
- Solana program development with Anchor
- Account management and validation
- Token operations and transfers
- Program-derived addresses (PDAs)
- Cross-program invocations (CPIs)
- Security best practices
- Testing and deployment workflows

## Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Turbin3 Cohort](https://turbin3.com/)

## Contributing

This repository is part of the Turbin3 educational program. Feel free to explore the code and learn from the implementations.

## License

This project is open source and available for educational purposes.

## Acknowledgments

- Turbin3 team for the comprehensive blockchain development curriculum
- Solana Foundation for the robust blockchain infrastructure
- Anchor framework contributors for simplifying Solana development

---

Built with dedication during the Turbin3 Q1 2026 Builders Cohort
