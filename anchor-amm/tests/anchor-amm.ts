import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorAmm } from "../target/types/anchor_amm";
<<<<<<< HEAD
import {
  createAssociatedTokenAccount,
  createMint,
  getAccount,
  getAssociatedTokenAddressSync,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { isSome } from "@metaplex-foundation/umi";

describe("anchor-amm", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const payer = provider.wallet.payer;
  const connection = provider.connection;

  // Declare Variables
  // mints
  let mint_x: PublicKey;
  let mint_y: PublicKey;
  let lp_mint: PublicKey;
  // config
  let seeds: anchor.BN;
  let config_addr: PublicKey;
  let config_bump: number;
  // user ATA
  let payer_x_ata: PublicKey;
  let payer_y_ata: PublicKey;
  let payer_lp_ata: PublicKey;
  // vaults
  let vault_x: PublicKey;
  let vault_y: PublicKey;

  before("Tokens and PDA setup", async () => {
    // derive the address for config
    seeds = new anchor.BN(1111);
    [config_addr, config_bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("config"), seeds.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    console.log("Config Address", config_addr);

    // create Mint accounts: X, Y and Lp_mint
    mint_x = await createMint(connection, payer, payer.publicKey, null, 6);
    console.log("Mint X created: ", mint_x);

    mint_y = await createMint(connection, payer, payer.publicKey, null, 6);
    console.log("Mint Y created: ", mint_y);

    [lp_mint] = PublicKey.findProgramAddressSync(
      [Buffer.from("lp"), config_addr.toBuffer()],
      program.programId
    );
    console.log("lp_mint created: ", lp_mint);

    // create and mint payers ATA for x, y mints
    payer_x_ata = await createAssociatedTokenAccount(
      connection,
      payer,
      mint_x,
      payer.publicKey
    );
    console.log("Created payer ata for mint X ", payer_x_ata);
    mintTo(connection, payer, mint_x, payer_x_ata, payer, 100000);
    console.log("Minted 100000 mint_x to payer_x_ata");

    payer_y_ata = await createAssociatedTokenAccount(
      connection,
      payer,
      mint_y,
      payer.publicKey
    );
    console.log("Created payer ata for mint Y ", payer_y_ata);
    mintTo(connection, payer, mint_y, payer_y_ata, payer, 100000);
    console.log("Minted 100000 mint_y to payer_y_ata");

    payer_lp_ata = getAssociatedTokenAddressSync(lp_mint, payer.publicKey);

    // create the vaults : X and Y
    vault_x = getAssociatedTokenAddressSync(mint_x, config_addr, true);
    console.log("Vault X: ", vault_x);
    vault_y = getAssociatedTokenAddressSync(mint_y, config_addr, true);
    console.log("Vault Y: ", vault_y);
  });

  const program = anchor.workspace.anchorAmm as Program<AnchorAmm>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize(seeds, 300, payer.publicKey)
      .accounts({
        initializer: payer.publicKey,
        mintX: mint_x,
        mintY: mint_y,
      })
      .rpc();
    console.log("Initialized config", tx);
  });

  it("Deposit to pool", async () => {
    const tx = await program.methods
      .deposit(new anchor.BN(6000), new anchor.BN(10000), new anchor.BN(50000))
      .accounts({
        user: payer.publicKey,
        mintX: mint_x,
        mintY: mint_y,
        mintLp: lp_mint,
        config: config_addr,
        vaultX: vault_x,
        vaultY: vault_y,
      })
      .rpc();
    console.log("Deposit complete", tx);
    let user_lp_mint_ata = await getAccount(connection, payer_lp_ata);
    console.log("", user_lp_mint_ata.amount);
    const get_vault_x = await getAccount(connection, vault_x);
    const get_vault_y = await getAccount(connection, vault_y);
    console.log(
      `Vault X : ${get_vault_x.amount}, Vault Y: ${get_vault_y.amount}`
    );
  });

  it("Swap", async () => {
    const tx = await program.methods
      .swap(true, new anchor.BN(1000), new anchor.BN(4422))
      .accounts({
        swapper: payer.publicKey,
        mintX: mint_x,
        mintY: mint_y,
        config: config_addr,
        vaultX: vault_x,
        vaultY: vault_y,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log("Swap complete! ", tx);
    const get_vault_x = await getAccount(connection, vault_x);
    const get_vault_y = await getAccount(connection, vault_y);
    console.log(
      `Vault X : ${get_vault_x.amount}, Vault Y: ${get_vault_y.amount}`
    );
  });

  it("Withdraw complete !", async () => {
    const tx = await program.methods
      .withdraw(new anchor.BN(5000), new anchor.BN(9166), new anchor.BN(37981))
      .accounts({
        withdrawer: payer.publicKey,
        mintX: mint_x,
        mintY: mint_y,
        config: config_addr,
        vaultX: vault_x,
        vaultY: vault_y,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log("Withdraw Complete! ", tx);
    const get_vault_x = await getAccount(connection, vault_x);
    const get_vault_y = await getAccount(connection, vault_y);
    console.log(
      `Vault X : ${get_vault_x.amount}, Vault Y: ${get_vault_y.amount}`
    );
=======
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
>>>>>>> origin/main
  });
});