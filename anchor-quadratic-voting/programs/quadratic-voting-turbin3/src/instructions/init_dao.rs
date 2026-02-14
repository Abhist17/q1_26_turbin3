use anchor_lang::prelude::*;

use crate::{seeds::DAO_SEED, state::Dao};

#[derive(Accounts)]
#[instruction(name:String)]
pub struct InitDao<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        init,
        payer = creator,
        space = Dao::DISCRIMINATOR.len() + Dao::INIT_SPACE,
        seeds = [DAO_SEED,creator.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub dao: Account<'info, Dao>,
    pub system_program: Program<'info, System>,
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct InitDaoArgs {
    pub dao_name: String,
    pub vote_token_mint: Pubkey,
}

impl<'info> InitDao<'info> {
    pub fn init_dao(&mut self, args: InitDaoArgs, bumps: InitDaoBumps) -> Result<()> {
        self.dao.set_inner(Dao {
            name: args.dao_name,
            vote_token_mint: args.vote_token_mint,
            authority: self.creator.key(),
            proposal_count: 0,
            bump: bumps.dao,
        });
        Ok(())
    }
}
