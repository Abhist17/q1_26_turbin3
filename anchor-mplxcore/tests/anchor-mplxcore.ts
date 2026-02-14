import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorMplxcoreQ425 } from "../target/types/anchor_mplxcore_q4_25";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

describe("anchor-mplxcore-q4-25", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.AnchorMplxcoreQ425 as Program<AnchorMplxcoreQ425>;
  const connection = provider.connection;

  // Accounts
  const payer = provider.wallet;
  const creator = Keypair.generate();
  const nonWhitelistedCreator = Keypair.generate();
  const collection = Keypair.generate();
  const asset = Keypair.generate();
  const unauthorizedAuthority = Keypair.generate();
  const invalidCollection = Keypair.generate();

  // PDAs
  let whitelistedCreatorsPda: PublicKey;
  let collectionAuthorityPda: PublicKey;
  let programDataAccount: PublicKey;
  let invalidCollectionAuthorityPda: PublicKey;

  before(async () => {
    // Fund accounts
    await provider.connection.requestAirdrop(creator.publicKey, 2_000_000_000);
    await provider.connection.requestAirdrop(nonWhitelistedCreator.publicKey, 2_000_000_000);
    await provider.connection.requestAirdrop(unauthorizedAuthority.publicKey, 2_000_000_000);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Derive PDAs
    whitelistedCreatorsPda = PublicKey.findProgramAddressSync(
      [Buffer.from("whitelist")],
      program.programId
    )[0];

    collectionAuthorityPda = PublicKey.findProgramAddressSync(
      [Buffer.from("collection_authority"), collection.publicKey.toBuffer()],
      program.programId
    )[0];

    invalidCollectionAuthorityPda = PublicKey.findProgramAddressSync(
      [Buffer.from("collection_authority"), invalidCollection.publicKey.toBuffer()],
      program.programId
    )[0];

    const BPF_LOADER_UPGRADEABLE_PROGRAM_ID = new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");
    programDataAccount = PublicKey.findProgramAddressSync(
      [program.programId.toBuffer()],
      BPF_LOADER_UPGRADEABLE_PROGRAM_ID
    )[0];
  });

  describe("WhitelistCreator", () => {
    it("Whitelist a creator", async () => {
      try {
        const sig = await program.methods
          .whitelistCreator()
          .accountsStrict({
            payer: payer.publicKey,
            creator: creator.publicKey,
            whitelistedCreators: whitelistedCreatorsPda,
            systemProgram: SystemProgram.programId,
            thisProgram: program.programId,
            programData: programDataAccount,
          })
          .rpc();
        console.log(`Whitelist creator tx: ${sig}`);

        const whitelistedCreators = await program.account.whitelistedCreators.fetch(whitelistedCreatorsPda);
        assert.include(
          whitelistedCreators.creators.map(c => c.toString()),
          creator.publicKey.toString(),
          "Creator should be whitelisted"
        );
      } catch (error) {
        console.error("Error whitelisting creator:", error);
        throw error;
      }
    });
  });

  describe("CreateCollection", () => {
    it("Create a collection", async () => {
      const args = {
        name: "Test Collection",
        uri: "https://devnet.irys.xyz/test",
        nftName: "Test NFT",
        nftUri: "https://gateway.irys.xyz/test",
      };

      const sig = await program.methods
        .createCollection(args)
        .accountsStrict({
          creator: creator.publicKey,
          collection: collection.publicKey,
          whitelistedCreators: whitelistedCreatorsPda,
          collectionAuthority: collectionAuthorityPda,
          coreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator, collection])
        .rpc();
      console.log(`Create collection tx: ${sig}`);

      const collectionAuthority = await program.account.collectionAuthority.fetch(collectionAuthorityPda);
      assert.equal(collectionAuthority.creator.toString(), creator.publicKey.toString());
    });
  });

  describe("MintNft", () => {
    it("Mints an NFT", async () => {
      const sig = await program.methods
        .mintNft()
        .accountsStrict({
          minter: payer.publicKey,
          asset: asset.publicKey,
          collection: collection.publicKey,
          collectionAuthority: collectionAuthorityPda,
          coreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([asset])
        .rpc();
      console.log(`Mint NFT tx: ${sig}`);
    });
  });

  describe("FreezeNft", () => {
    it("Freeze an NFT", async () => {
      const sig = await program.methods
        .freezeNft()
        .accountsStrict({
          authority: creator.publicKey,
          asset: asset.publicKey,
          collection: collection.publicKey,
          collectionAuthority: collectionAuthorityPda,
          coreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
      console.log(`Freeze NFT tx: ${sig}`);
    });
  });

  describe("ThawNft", () => {
    it("Thaw an NFT", async () => {
      const sig = await program.methods
        .thawNft()
        .accountsStrict({
          authority: creator.publicKey,
          asset: asset.publicKey,
          collection: collection.publicKey,
          collectionAuthority: collectionAuthorityPda,
          coreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
      console.log(`Thaw NFT tx: ${sig}`);
    });
  });
});
