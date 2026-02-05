use anchor_lang::prelude::*;
use anchor_spl::{
    token::{transfer, Token, TokenAccount, Transfer},
};

use crate::state::Config;

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: This is the authority PDA for the AMM
    #[account(
        seeds = [b"auth"],
        bump = config.auth_bump,
    )]
    pub auth: AccountInfo<'info>,
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub user_x: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_y: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_x: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_y: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

impl<'info> Swap<'info> {
    pub fn swap(&mut self, _is_x: bool, _amount: u64, _min: u64) -> Result<()> {
        // TODO: Implement swap logic
        Ok(())
    }

    pub fn deposit_tokens(&mut self, is_x: bool, amount: u64) -> Result<()> {
        let (from, to) = if is_x {
            (&self.user_x, &self.vault_x)
        } else {
            (&self.user_y, &self.vault_y)
        };

        let cpi_accounts = Transfer {
            from: from.to_account_info(),
            to: to.to_account_info(),
            authority: self.user.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);

        transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn withdraw_tokens(&mut self, is_x: bool, amount: u64) -> Result<()> {
        let (from, to) = if is_x {
            (&self.vault_x, &self.user_x)
        } else {
            (&self.vault_y, &self.user_y)
        };

        let cpi_accounts = Transfer {
            from: from.to_account_info(),
            to: to.to_account_info(),
            authority: self.auth.to_account_info(),
        };

        let seeds = &[
            &b"auth"[..],
            &[self.config.auth_bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds
        );

        transfer(cpi_ctx, amount)?;

        Ok(())
    }
}