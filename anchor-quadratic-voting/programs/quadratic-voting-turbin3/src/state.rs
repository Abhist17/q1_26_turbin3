use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Dao {
    #[max_len(50)]
    pub name: String,
    pub authority: Pubkey,
    pub proposal_count: u64,
    pub vote_token_mint: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Proposal {
    pub authority: Pubkey,
    #[max_len(50)]
    pub name: String,
    #[max_len(200)]
    pub description: String,
    pub votes_yes: u64,
    pub votes_no: u64,
    pub bump: u8,
}

#[repr(u8)]
#[derive(Clone, InitSpace, AnchorSerialize, AnchorDeserialize)]
pub enum VoteChoice {
    Yes,
    No,
}

#[account]
#[derive(InitSpace)]
pub struct Vote {
    pub authority: Pubkey,
    pub vote_type: VoteChoice,
    pub vote_credits: u64,
    pub bump: u8,
}
