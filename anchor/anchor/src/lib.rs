use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, MintTo, Token, TokenAccount, Transfer},
    system_program,
};
use solana_program::program_option::COption;
use std::collections::HashMap;

#[program]
pub mod meme_coins {
    use super::*;

    pub fn create_meme_coin(ctx: Context<CreateMemeCoin>, name: String, symbol: String) -> Result<()> {
        let mint = &ctx.accounts.mint;
        let authority = &ctx.accounts.authority;

        // Créer le mint
        let mint_data = Mint {
            decimals: 9,
            is_initialized: true,
            mint_authority: Some(COption::Some(authority.key())),
            freeze_authority: None,
            max_supply: None,
        };

        token::create_mint(
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.authority.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            &mint_data,
        )?;

        // Créer un compte de dépôt pour le mint
        let deposit_account = ctx.accounts.deposit_account;
        token::mint_to(
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.authority.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            &deposit_account,
            &[],
            10_000_000, // 10M tokens
        )?;

        msg!("Meme coin '{}' created!", name);
        Ok(())
    }

    pub fn deploy_coin_with_fee(ctx: Context<DeployCoinWithFee>, fee_amount: u64) -> Result<()> {
        let authority = &ctx.accounts.authority;
        let payer = &ctx.accounts.payer;

        // Vérifier que le paiement a lieu
        if ctx.accounts.payer.key() != ctx.accounts.fee_account.key() {
            msg!("Payer must be the fee account");
            return Err(ProgramError::InvalidArgument);
        }

        // Transférer les frais au compte du déploiement
        let token_program = &ctx.accounts.token_program;
        let mint = &ctx.accounts.mint;

        let transfer_instruction = Transfer {
            from: ctx.accounts.fee_account.to_account_info(),
            to: ctx.accounts.deposit_account.to_account_info(),
            authority: Some(ctx.accounts.authority.to_account_info()),
            amount: fee_amount,
        };

        token::transfer(
            COption::Some(token_program.to_account_info()),
            &ctx.accounts.fee_account.to_account_info(),
            &ctx.accounts.deposit_account.to_account_info(),
            &[],
            ctx.accounts.authority.key(),
            10_000_000, // 10M tokens
        )?;

        msg!("Coin deployed with fee paid by user!");
        Ok(())
    }

    pub fn add_liquidity(ctx: Context<AddLiquidity>, amount: u64) -> Result<()> {
        let pool = &ctx.accounts.pool;
        let mint_a = &ctx.accounts.mint;

        // Vérifier que le pool existe
        if !pool.is_initialized() {
            return Err(ProgramError::InvalidArgument);
        }

        msg!("Liquidité ajoutée : {} tokens", amount);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMemeCoin<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 16, // Taille du mint
        seeds = [b"mint", authority.key().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 16,
        seeds = [b"deposit_account", authority.key().as_ref()],
        bump
    )]
    pub deposit_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct DeployCoinWithFee<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 16,
        seeds = [b"mint", authority.key().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 16,
        seeds = [b"deposit_account", authority.key().as_ref()],
        bump
    )]
    pub deposit_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub fee_account: AccountInfo<'info>, // Compte qui reçoit les frais
}

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 16,
        seeds = [b"pool", authority.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}
