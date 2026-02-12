use anchor_lang::prelude::*;
use anchor_spl::{
<<<<<<< HEAD
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};
use constant_product_curve::ConstantProduct;

use crate::{error::AmmError, state::Config};
=======
    token::{transfer, Token, TokenAccount, Transfer},
};

use crate::state::Config;
>>>>>>> origin/main

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
<<<<<<< HEAD
    pub mint_x: Account<'info, Mint>,
    pub mint_y: Account<'info, Mint>,
=======
>>>>>>> origin/main
    /// CHECK: This is the authority PDA for the AMM
    #[account(
        seeds = [b"auth"],
        bump = config.auth_bump,
    )]
    pub auth: AccountInfo<'info>,
<<<<<<< HEAD
    #[account(
        has_one = mint_x,
        has_one = mint_y,
        seeds = [b"config", config.seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
    )]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        associated_token::mint = mint_x,
        associated_token::authority = user
    )]
    pub user_x: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = mint_y,
        associated_token::authority = user
    )]
    pub user_y: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = mint_x,
        associated_token::authority = auth
    )]
    pub vault_x: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = mint_y,
        associated_token::authority = auth
    )]
    pub vault_y: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> Swap<'info> {
    pub fn swap(&mut self, is_x: bool, amount_in: u64, min_amount_out: u64) -> Result<()> {
        require!(self.config.locked == false, AmmError::PoolLocked);
        require!(amount_in > 0, AmmError::InvalidAmount);
        require!(
            self.vault_x.amount > 0 && self.vault_y.amount > 0,
            AmmError::NoLiquidityInPool
        );

        // Calculate swap output
        let amount_out = if is_x {
            let result = ConstantProduct::swap(
                self.vault_x.amount,
                self.vault_y.amount,
                amount_in,
                self.config.fee,
                6,
            )
            .map_err(|_| AmmError::CurveError)?;
            result.out
        } else {
            let result = ConstantProduct::swap(
                self.vault_y.amount,
                self.vault_x.amount,
                amount_in,
                self.config.fee,
                6,
            )
            .map_err(|_| AmmError::CurveError)?;
            result.out
        };

        require!(amount_out >= min_amount_out, AmmError::SlippageExceeded);

        // Deposit input tokens
        self.deposit_tokens(is_x, amount_in)?;

        // Withdraw output tokens
        self.withdraw_tokens(!is_x, amount_out)?;

        Ok(())
    }

    pub fn deposit_tokens(&self, is_x: bool, amount: u64) -> Result<()> {
        let (from, to) = match is_x {
            true => (
                self.user_x.to_account_info(),
                self.vault_x.to_account_info(),
            ),
            false => (
                self.user_y.to_account_info(),
                self.vault_y.to_account_info(),
            ),
        };

        let cpi_accounts = Transfer {
            from,
            to,
=======
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
>>>>>>> origin/main
            authority: self.user.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);

<<<<<<< HEAD
        transfer(cpi_ctx, amount)
    }

    pub fn withdraw_tokens(&self, is_x: bool, amount: u64) -> Result<()> {
        let (from, to) = match is_x {
            true => (
                self.vault_x.to_account_info(),
                self.user_x.to_account_info(),
            ),
            false => (
                self.vault_y.to_account_info(),
                self.user_y.to_account_info(),
            ),
        };

        let cpi_accounts = Transfer {
            from,
            to,
            authority: self.auth.to_account_info(),
        };

        let seeds = &[&b"auth"[..], &[self.config.auth_bump]];
=======
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
>>>>>>> origin/main

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
<<<<<<< HEAD
            signer_seeds,
        );

        transfer(cpi_ctx, amount)
    }
}
=======
            signer_seeds
        );

        transfer(cpi_ctx, amount)?;

        Ok(())
    }
}
>>>>>>> origin/main
