import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorAmm } from "../target/types/anchor_amm";
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { assert } from "chai";

describe("anchor-amm", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorAmm as Program<AnchorAmm>;
  
  const payer = provider.wallet as anchor.Wallet;
  const user = anchor.web3.Keypair.generate();
  
  let mintX: anchor.web3.PublicKey;
  let mintY: anchor.web3.PublicKey;
  
  const seed = new anchor.BN(1);
  const fee = 300;
  
  let config: anchor.web3.PublicKey;
  let auth: anchor.web3.PublicKey;
  let mintLp: anchor.web3.PublicKey;
  let vaultX: anchor.web3.PublicKey;
  let vaultY: anchor.web3.PublicKey;
  
  let userX: anchor.web3.PublicKey;
  let userY: anchor.web3.PublicKey;
  let userLp: anchor.web3.PublicKey;

  before(async () => {
    const airdropSig = await provider.connection.requestAirdrop(
      user.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig);

    mintX = await createMint(
      provider.connection,
      payer.payer,
      payer.publicKey,
      null,
      6
    );

    mintY = await createMint(
      provider.connection,
      payer.payer,
      payer.publicKey,
      null,
      6
    );

    console.log("Mint X:", mintX.toString());
    console.log("Mint Y:", mintY.toString());

    [config] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("config"), seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    [auth] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("auth")],
      program.programId
    );

    [mintLp] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("lp"), config.toBuffer()],
      program.programId
    );

    vaultX = anchor.utils.token.associatedAddress({
      mint: mintX,
      owner: auth,
    });

    vaultY = anchor.utils.token.associatedAddress({
      mint: mintY,
      owner: auth,
    });

    console.log("Config:", config.toString());
    console.log("Auth:", auth.toString());
    console.log("LP Mint:", mintLp.toString());
    console.log("Vault X:", vaultX.toString());
    console.log("Vault Y:", vaultY.toString());

    const userXAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      mintX,
      user.publicKey
    );
    userX = userXAccount.address;

    const userYAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      mintY,
      user.publicKey
    );
    userY = userYAccount.address;

    await mintTo(
      provider.connection,
      payer.payer,
      mintX,
      userX,
      payer.publicKey,
      1_000_000_000
    );

    await mintTo(
      provider.connection,
      payer.payer,
      mintY,
      userY,
      payer.publicKey,
      1_000_000_000
    );

    console.log("User X:", userX.toString());
    console.log("User Y:", userY.toString());

    userLp = anchor.utils.token.associatedAddress({
      mint: mintLp,
      owner: user.publicKey,
    });
  });

  it("Initializes the AMM pool", async () => {
    try {
      const tx = await program.methods
        .initialize(seed, fee, null)
        .accounts({
          initializer: payer.publicKey,
          mintX: mintX,
          mintY: mintY,
          config: config,
          auth: auth,
          mintLp: mintLp,
          vaultX: vaultX,
          vaultY: vaultY,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Initialize transaction signature:", tx);

      const configAccount = await program.account.config.fetch(config);
      
      assert.equal(configAccount.seed.toNumber(), seed.toNumber());
      assert.equal(configAccount.fee, fee);
      console.log("Pool initialized successfully!");
    } catch (e) {
      console.log("Full error:", JSON.stringify(e, null, 2));
      throw e;
    }
  });

  it("Deposits liquidity to the pool", async () => {
    const depositAmount = new anchor.BN(100_000_000);
    const maxX = new anchor.BN(100_000_000);
    const maxY = new anchor.BN(100_000_000);

    try {
      const tx = await program.methods
        .deposit(depositAmount, maxX, maxY)
        .accounts({
          user: user.publicKey,
          mintX: mintX,
          mintY: mintY,
          auth: auth,
          mintLp: mintLp,
          config: config,
          vaultX: vaultX,
          vaultY: vaultY,
          userX: userX,
          userY: userY,
          userLp: userLp,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("Deposit transaction signature:", tx);

      const vaultXAccount = await getAccount(provider.connection, vaultX);
      const vaultYAccount = await getAccount(provider.connection, vaultY);
      
      console.log("Vault X balance:", vaultXAccount.amount.toString());
      console.log("Vault Y balance:", vaultYAccount.amount.toString());

      const userLpAccount = await getAccount(provider.connection, userLp);
      console.log("User LP balance:", userLpAccount.amount.toString());

      console.log("Liquidity deposited successfully!");
    } catch (e) {
      console.log("Full error:", JSON.stringify(e, null, 2));
      throw e;
    }
  });
});