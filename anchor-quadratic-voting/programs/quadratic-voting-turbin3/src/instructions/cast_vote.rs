use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

use crate::{
    seeds::{DAO_SEED, PROPOSAL_SEED, VOTE_SEED},
    state::{Dao, Proposal, Vote, VoteChoice},
};

#[derive(Accounts)]
#[instruction(args: CastVoteArgs)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(
        seeds = [DAO_SEED,args.dao_creator.as_ref(), args.dao_name.as_bytes()],
        bump = dao.bump
    )]
    pub dao: Account<'info, Dao>,
    #[account(
        mut,
        seeds = [PROPOSAL_SEED,dao.key().as_ref(), &args.proposal_index.to_le_bytes()],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, Proposal>,
    #[account(
        init,
        payer = voter,
        space = Vote::DISCRIMINATOR.len() + Vote::INIT_SPACE,
        seeds = [VOTE_SEED, voter.key().as_ref(), proposal.key().as_ref()],
        bump
    )]
    pub vote: Account<'info, Vote>,
    #[account(address = dao.vote_token_mint)]
    pub vote_token_mint: Account<'info, Mint>,
    #[account(
        associated_token::authority = voter,
        associated_token::mint = vote_token_mint
    )]
    pub voter_ata: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CastVoteArgs {
    pub dao_name: String,
    pub dao_creator: Pubkey,
    pub proposal_index: u64,
    pub vote: VoteChoice,
}

impl<'info> CastVote<'info> {
    pub fn cast_vote(&mut self, args: CastVoteArgs, bumps: CastVoteBumps) -> Result<()> {
        let vote_credits = (self.voter_ata.amount as f64).sqrt() as u64;
        match args.vote {
            VoteChoice::Yes => self.proposal.votes_yes += vote_credits,
            VoteChoice::No => self.proposal.votes_no += vote_credits,
        };

        self.vote.set_inner(Vote {
            authority: self.voter.key(),
            vote_type: args.vote,
            vote_credits,
            bump: bumps.vote,
        });
        Ok(())
    }
}
