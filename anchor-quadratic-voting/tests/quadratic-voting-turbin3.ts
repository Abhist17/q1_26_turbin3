import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { QuadraticVotingTurbin3 } from "../target/types/quadratic_voting_turbin3";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { expect } from "chai";
import BN from "bn.js";

describe("quadratic-voting-turbin3", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .quadraticVotingTurbin3 as Program<QuadraticVotingTurbin3>;
  const wallet = provider.wallet as anchor.Wallet;

  const daoName = "test-dao";
  let mint: PublicKey;
  let voterAtaAddress: PublicKey;

  const [daoPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("dao"), wallet.publicKey.toBuffer(), Buffer.from(daoName)],
    program.programId,
  );

  const proposalIndex = new BN(0);
  const [proposalPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("proposal"),
      daoPda.toBuffer(),
      proposalIndex.toArrayLike(Buffer, "le", 8),
    ],
    program.programId,
  );

  const [votePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vote"), wallet.publicKey.toBuffer(), proposalPda.toBuffer()],
    program.programId,
  );

  before(async () => {
    // Create mint for vote tokens
    mint = await createMint(
      provider.connection,
      wallet.payer,
      wallet.publicKey,
      null,
      6,
    );

    // Create voter ATA and mint 100 tokens (100 * 10^6)
    const ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      wallet.payer,
      mint,
      wallet.publicKey,
    );
    voterAtaAddress = ata.address;

    await mintTo(
      provider.connection,
      wallet.payer,
      mint,
      voterAtaAddress,
      wallet.publicKey,
      100_000_000,
    );
  });

  it("initializes a DAO", async () => {
    await program.methods
      .initDao({
        daoName,
        voteTokenMint: mint,
      })
      .accountsStrict({
        creator: wallet.publicKey,
        dao: daoPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const daoAccount = await program.account.dao.fetch(daoPda);
    expect(daoAccount.name).to.equal(daoName);
    expect(daoAccount.authority.toBase58()).to.equal(
      wallet.publicKey.toBase58(),
    );
    expect(daoAccount.proposalCount.toNumber()).to.equal(0);
    expect(daoAccount.voteTokenMint.toBase58()).to.equal(mint.toBase58());
  });

  it("creates a proposal", async () => {
    await program.methods
      .initProposal({
        daoName,
        daoCreator: wallet.publicKey,
        proposalName: "Test Proposal",
        proposalDescription: "A test proposal for quadratic voting",
      })
      .accountsStrict({
        proposer: wallet.publicKey,
        dao: daoPda,
        proposal: proposalPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const proposalAccount = await program.account.proposal.fetch(proposalPda);
    expect(proposalAccount.name).to.equal("Test Proposal");
    expect(proposalAccount.description).to.equal(
      "A test proposal for quadratic voting",
    );
    expect(proposalAccount.authority.toBase58()).to.equal(
      wallet.publicKey.toBase58(),
    );
    expect(proposalAccount.votesYes.toNumber()).to.equal(0);
    expect(proposalAccount.votesNo.toNumber()).to.equal(0);

    const daoAccount = await program.account.dao.fetch(daoPda);
    expect(daoAccount.proposalCount.toNumber()).to.equal(1);
  });

  it("casts a vote", async () => {
    await program.methods
      .castVote({
        daoName,
        daoCreator: wallet.publicKey,
        proposalIndex,
        vote: { yes: {} },
      })
      .accountsStrict({
        voter: wallet.publicKey,
        dao: daoPda,
        proposal: proposalPda,
        vote: votePda,
        voteTokenMint: mint,
        voterAta: voterAtaAddress,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const voteAccount = await program.account.vote.fetch(votePda);
    expect(voteAccount.authority.toBase58()).to.equal(
      wallet.publicKey.toBase58(),
    );
    // sqrt(100_000_000) = 10000
    expect(voteAccount.voteCredits.toNumber()).to.equal(10000);

    const proposalAccount = await program.account.proposal.fetch(proposalPda);
    expect(proposalAccount.votesYes.toNumber()).to.equal(10000);
    expect(proposalAccount.votesNo.toNumber()).to.equal(0);
  });
});
// Final test file for Quadratic Voting
// This test file tests the following:
// 1. Initializes a DAO
// 2. Creates a proposal
// 3. Casts a vote
