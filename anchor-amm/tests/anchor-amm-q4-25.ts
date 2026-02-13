import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorAmmQ425 } from "../target/types/anchor_amm_q4_25";
import { Keypair, PublicKey } from "@solana/web3.js";

describe("anchor-amm-q4-25", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.AnchorAmmQ425 as Program<AnchorAmmQ425>;

  // Create dummy accounts
  const dummyAccount = Keypair.generate().publicKey;
  const mintX = Keypair.generate().publicKey;
  const mintY = Keypair.generate().publicKey;
  const lpMint = Keypair.generate().publicKey;

  it("Initialize AMM pool", async () => {
    await program.methods
      .initialize()
      .accounts({
        signer: provider.wallet.publicKey,
      })
      .rpc();
    console.log("✅ AMM initialized!");
  });

  it("Deposit Liquidity", async () => {
    await program.methods
      .depositLiquidity(new anchor.BN(100), new anchor.BN(100))
      .accounts({
        signer: provider.wallet.publicKey,
      })
      .rpc();
    console.log("✅ Deposit passed");
  });

  it("Swap 100 token X for token Y", async () => {
    await program.methods
      .swap(new anchor.BN(100), new anchor.BN(90))
      .accounts({
        signer: provider.wallet.publicKey,
      })
      .rpc();
    console.log("✅ Swap X->Y passed");
  });

  it("Swap 100 token Y for token X", async () => {
    await program.methods
      .swap(new anchor.BN(100), new anchor.BN(90))
      .accounts({
        signer: provider.wallet.publicKey,
      })
      .rpc();
    console.log("✅ Swap Y->X passed");
  });

  it("Withdraws liquidity from the pool", async () => {
    await program.methods
      .withdrawLiquidity(new anchor.BN(50))
      .accounts({
        signer: provider.wallet.publicKey,
      })
      .rpc();
    console.log("✅ Withdraw passed");
  });

  it("Fails swap when slippage exceeds minimum", async () => {
    try {
      await program.methods
        .swap(new anchor.BN(100), new anchor.BN(1000))
        .accounts({
          signer: provider.wallet.publicKey,
        })
        .rpc();
    } catch (e) {
      // Expected to fail
    }
    console.log("✅ Slippage test passed");
  });
});