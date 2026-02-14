use anchor_lang::prelude::*;
use anchor_instruction_sysvar::Ed25519InstructionSignatures;

use crate::{errors::DiceError, state::Bet};

#[derive(Accounts)]
pub struct ResolveBet<'info> {
    #[account(mut)]
    pub house: Signer<'info>,
    #[account(mut)]
    pub player: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [b"vault", house.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,
    #[account(
        mut,
        close = player,
        seeds = [b"bet", vault.key().as_ref(), bet.seed.to_le_bytes().as_ref()],
        bump = bet.bump
    )]
    pub bet: Account<'info, Bet>,
    #[account(
        address = anchor_lang::solana_program::sysvar::instructions::ID
    )]
    /// CHECK: This is the instructions sysvar
    pub instruction_sysvar: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> ResolveBet<'info> {
    pub fn verify_ed25519_signature(&mut self, sig: &[u8]) -> Result<()> {
        let ix_sysvar = &self.instruction_sysvar;

        let ix_data = anchor_lang::solana_program::sysvar::instructions::load_instruction_at_checked(
            0,
            ix_sysvar,
        )
        .map_err(|_| DiceError::Ed25519Program)?;

        require!(
            ix_data.program_id == anchor_lang::solana_program::ed25519_program::ID,
            DiceError::Ed25519Program
        );

        let ed25519_ixs = Ed25519InstructionSignatures::unpack(&ix_data.data)
            .map_err(|_| DiceError::Ed25519Header)?;

        let ed25519_ix = ed25519_ixs
            .0
            .first()
            .ok_or(DiceError::Ed25519Header)?;

        // Verify signature
        let ix_sig = ed25519_ix
            .signature
            .as_ref()
            .ok_or(DiceError::Ed25519Signature)?;
        require!(
            ix_sig.as_slice() == sig,
            DiceError::Ed25519Signature
        );

        // Verify public key (signer is house)
        let ix_pubkey = ed25519_ix
            .public_key
            .as_ref()
            .ok_or(DiceError::Ed25519Pubkey)?;
        require!(
            ix_pubkey.as_ref() == self.house.key().as_ref(),
            DiceError::Ed25519Pubkey
        );

        // Verify message is the bet data
        let ix_msg = ed25519_ix
            .message
            .as_ref()
            .ok_or(DiceError::Ed25519Message)?;
        require!(
            ix_msg.as_slice() == self.bet.to_slice().as_slice(),
            DiceError::Ed25519Message
        );

        Ok(())
    }

    pub fn resolve_bet_transfer(&mut self, sig: &[u8], bumps: &ResolveBetBumps) -> Result<()> {
        let hash = anchor_lang::solana_program::hash::hash(sig);
        let hash_ref = hash.to_bytes();

        let result = hash_ref[0] % 100;

        if result < self.bet.roll {
            let payout = (self.bet.amount as u128)
                .checked_mul(10000u128)
                .ok_or(DiceError::Overflow)?
                .checked_div(self.bet.roll as u128)
                .ok_or(DiceError::Overflow)? as u64;

            let accounts = anchor_lang::system_program::Transfer {
                from: self.vault.to_account_info(),
                to: self.player.to_account_info(),
            };

            let signer_seeds: &[&[&[u8]]] =
                &[&[b"vault", self.house.key.as_ref(), &[bumps.vault]]];

            let ctx = CpiContext::new_with_signer(
                self.system_program.to_account_info(),
                accounts,
                signer_seeds,
            );

            anchor_lang::system_program::transfer(ctx, payout)?;
        }

        Ok(())
    }
}