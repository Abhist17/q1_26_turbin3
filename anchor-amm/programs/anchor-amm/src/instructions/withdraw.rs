use anchor_lang::prelude::*;

use crate::state::Config;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub config: Account<'info, Config>,
}

impl<'info> Withdraw<'info> {
    pub fn withdraw(
        &mut self,
        _amount: u64,
        _min_x: u64,
        _min_y: u64,
    ) -> Result<()> {
        Ok(())
    }
}

// This standalone function is required by Anchor's #[program] macro
pub fn withdraw(ctx: Context<Withdraw>, amount: u64, min_x: u64, min_y: u64) -> Result<()> {
    ctx.accounts.withdraw(amount, min_x, min_y)
}