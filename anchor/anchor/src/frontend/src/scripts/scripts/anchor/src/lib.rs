pub fn generate_pumpfun_url(ctx: Context<GeneratePumpfunUrl>, name: String, symbol: String) -> Result<String> {
    let url = format!("https://pump.fun/{}", name);
    msg!("URL générée pour Pump.fun : {}", url);

    Ok(url)
}
