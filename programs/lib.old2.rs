// programs/bridge/src/lib.rs

use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};

declare_id!("YourProgramIDHere"); // Replace with your actual program ID

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
        proof: Vec<u8>,
        public_input: [u8; 32],
    ) -> Result<()> {
        let processed = &mut ctx.accounts.processed;

        require!(
            !processed.used.contains(&burn_id),
            ErrorCode::AlreadyProcessed
        );

        // 👇 Call external verifier CPI (stubbed here)
        let valid = verify_zk(&proof, &public_input)?;
        require!(valid, ErrorCode::InvalidZkProof);

        // Mark burn_id as processed
        processed.used.push(burn_id);

        // Transfer tokens to user
        let vault = &ctx.accounts.vault;
        let cpi_accounts = Transfer {
            from: vault.to_account_info(),
            to: ctx.accounts.user_ata.to_account_info(),
            authority: ctx.accounts.pda_signer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        anchor_spl::token::transfer(cpi_ctx, amount)?;

        Ok(())
    }
}

/// Dummy verifier function for ZK proof (replace with actual implementation)
fn verify_zk(_proof: &Vec<u8>, _public_input: &[u8; 32]) -> Result<bool> {
    Ok(true) // Always returns true for dev/demo purposes
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct UnlockWithZk<'info> {
    #[account(mut, seeds = [b"vault"], bump)]
    pub vault: Account<'info, TokenAccount>,

    #[account(mut, seeds = [b"processed"], bump)]
    pub processed: Account<'info, Processed>,

    /// CHECK: PDA authority signer (used to sign token transfer)
    #[account(seeds = [b"vault"], bump)]
    pub pda_signer: UncheckedAccount<'info>,

    #[account(mut)]
    pub user_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Processed {
    pub used: Vec<[u8; 32]>, // List of processed burn_ids
}

#[error_code]
pub enum ErrorCode {
    #[msg("Burn ID already processed")]
    AlreadyProcessed,

    #[msg("Invalid ZK proof")]
    InvalidZkProof,
}
