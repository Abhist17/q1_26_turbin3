import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorDiceGameQ425 } from "../target/types/anchor_dice_game_q4_25";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";

describe("anchor-dice-game-q4-25", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorDiceGameQ425 as Program<AnchorDiceGameQ425>;

  const house = provider.wallet;

  const [vault] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), house.publicKey.toBuffer()],
    program.programId
  );

  it("Initialize vault", async () => {
    const amount = new anchor.BN(0.1 * LAMPORTS_PER_SOL);

    const tx = await program.methods
      .initialize(amount)
      .accountsStrict({
        house: house.publicKey,
        vault: vault,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Initialize tx:", tx);

    const vaultBalance = await provider.connection.getBalance(vault);
    console.log("Vault balance:", vaultBalance / LAMPORTS_PER_SOL, "SOL");
    expect(vaultBalance).to.equal(0.1 * LAMPORTS_PER_SOL);
  });

  it("Place bet", async () => {
    const seed = new anchor.BN(1);
    const roll = 50;
    const amount = new anchor.BN(0.01 * LAMPORTS_PER_SOL);

    const [bet] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("bet"),
        vault.toBuffer(),
        seed.toArrayLike(Buffer, "le", 16),
      ],
      program.programId
    );

    const tx = await program.methods
      .placeBet(seed, roll, amount)
      .accountsStrict({
        player: house.publicKey,
        house: house.publicKey,
        vault: vault,
        bet: bet,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Place bet tx:", tx);

    const betAccount = await program.account.bet.fetch(bet);
    console.log("Bet roll:", betAccount.roll);
    console.log("Bet amount:", betAccount.amount.toNumber() / LAMPORTS_PER_SOL, "SOL");
    expect(betAccount.roll).to.equal(roll);
  });
});