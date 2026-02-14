use anchor_lang::prelude::*;
mod instructions;
mod seeds;
mod state;
use instructions::*;

declare_id!("6nWmvJJwUkfyioGrjp46RuCgAaxSY5BpCGvwJjd6Ddn");

#[program]
pub mod quadratic_voting_turbin3 {

    use super::*;

    pub fn init_dao(ctx: Context<InitDao>, args: InitDaoArgs) -> Result<()> {
        ctx.accounts.init_dao(args, ctx.bumps)
    }

    pub fn init_proposal(ctx: Context<InitProposal>, args: InitProposalArgs) -> Result<()> {
        ctx.accounts.init_proposal(args, ctx.bumps)
    }

    pub fn cast_vote(ctx: Context<CastVote>, args: CastVoteArgs) -> Result<()> {
        ctx.accounts.cast_vote(args, ctx.bumps)
    }
}
