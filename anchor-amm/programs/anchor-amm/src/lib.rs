<<<<<<< HEAD
use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod state;

use instructions::*;
declare_id!("FWS4nCkyRQhov3dZkJkbia3dzr49UvsobQtFAgrde2Ck");

#[program]
pub mod anchor_amm {

    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        seed: u64,
        fee: u16,
        authority: Option<Pubkey>,
    ) -> Result<()> {
        ctx.accounts.init(seed, fee, authority, ctx.bumps)
=======
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use error::*;         // ← ADD THIS LINE
pub use instructions::*;
pub use state::*;

declare_id!("H9Ynn2dNpmbpJ8SUJEyWwQJLnJ2ZKEmTqun6RCmWpdBM");

#[program]
pub mod anchor_amm {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, seed: u64, fee: u16, authority: Option<Pubkey>) -> Result<()> {
        ctx.accounts.init(seed, fee, authority, &ctx.bumps)
>>>>>>> origin/main
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64, max_x: u64, max_y: u64) -> Result<()> {
        ctx.accounts.deposit(amount, max_x, max_y)
    }
<<<<<<< HEAD

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64, max_x: u64, max_y: u64) -> Result<()> {
        ctx.accounts.withdraw(amount, max_x, max_y)
    }

    pub fn swap(ctx: Context<Swap>, is_x: bool, amount_in: u64, min_amount_out: u64) -> Result<()> {
        ctx.accounts.swap(is_x, amount_in, min_amount_out)
    }
=======
>>>>>>> origin/main
}