use anchor_lang::prelude::*;

use crate::{
    seeds::{DAO_SEED, PROPOSAL_SEED},
    state::{Dao, Proposal},
};

#[derive(Accounts)]
#[instruction(args: InitProposalArgs)]
pub struct InitProposal<'info> {
    #[account(mut)]
    pub proposer: Signer<'info>,
    #[account(
        mut,
        seeds = [DAO_SEED,args.dao_creator.as_ref(), args.dao_name.as_bytes()],
        bump = dao.bump
    )]
    pub dao: Account<'info, Dao>,
    #[account(
        init,
        payer = proposer,
        space = Proposal::DISCRIMINATOR.len() + Proposal::INIT_SPACE,
        seeds = [PROPOSAL_SEED, dao.key().as_ref(), &dao.proposal_count.to_le_bytes()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    pub system_program: Program<'info, System>,
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct InitProposalArgs {
    pub dao_name: String,
    pub dao_creator: Pubkey,
    pub proposal_name: String,
    pub proposal_description: String,
}

impl<'info> InitProposal<'info> {
    pub fn init_proposal(
        &mut self,
        args: InitProposalArgs,
        bumps: InitProposalBumps,
    ) -> Result<()> {
        self.dao.proposal_count += 1;

        self.proposal.set_inner(Proposal {
            authority: self.proposer.key(),
            name: args.proposal_name,
            description: args.proposal_description,
            votes_yes: 0,
            votes_no: 0,
            bump: bumps.proposal,
        });
        Ok(())
    }
}
