// programs/bridge/src/lib.rs
use anchor_lang::prelude::*;
use anchor_spl::token::{ Token, TokenAccount, Transfer };

declare_id!("YourProgramIDHere");

#[program]
pub mod crosschain_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn unlock_with_zk(
        ctx: Context<UnlockWithZk>,
        user: Pubkey,
        amount: u64,
        burn_id: [u8; 32],
        proof: Vec<u8>, // zk proof data
        public_input: [u8; 32],
    ) -> Result<()> {
        let processed = &mut ctx.accounts.processed;
        require!(!processed.used.contains(&burn_id), ErrorCode::AlreadyProcessed);

        // Call external verifier (via CPI)
        let valid = verify_zk(&proof, &public_input)?;
        require!(valid, ErrorCode::InvalidZkProof);

        processed.used.push(burn_id);

        let vault = &ctx.accounts.vault;
        let cpi = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: vault.to_account_info(),
                to: ctx.accounts.user_ata.to_account_info(),
                authority: ctx.accounts.pda_signer.to_account_info(),
            },
        );
        anchor_spl::token::transfer(cpi, amount)?;
        Ok(())
    }
}

// Context structures
#[derive(Accounts)]
pub struct UnlockWithZk<'info> {
    #[account(mut, seeds = [b"vault"], bump)]
    pub vault: Account<'info, Vault>,
    #[account(mut, seeds = [b"processed"], bump)]
    pub processed: Account<'info, Processed>,
    /// CHECK: PDA authority
    #[account(seeds = [b"vault"], bump)]
    pub pda_signer: UncheckedAccount<'info>,
    #[account(mut)]
    pub user_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

// Shared account types
#[account]
pub struct Vault { dummy: u8 }

#[account]
pub struct Processed { pub used: Vec<[u8; 32]> }

// Error codes
#[error_code]
pub enum ErrorCode {
    #[msg("Burn ID already processed")] AlreadyProcessed,
    #[msg("Invalid zk proof")] InvalidZkProof,
}
