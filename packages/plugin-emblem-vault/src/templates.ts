export const solanaBalanceTemplate = `
Extract the following details to get the solana balance:
- **vaultIdOrAddress** (string): Vault ID or Address of the solana account

Provide the values in the following JSON format:

\`\`\`json
{
    "vaultIdOrAddress": "<vault_id_or_address>"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const solanaTransferTemplate = `
Here are the recent user messages for context:
{{recentMessages}}

Here is the wallet information:
{{walletInfo}}

Here is the vault id: {{vaultId}}

Here are the mint address of the token from wallet info:
{{mintAddresses}}

Extract the following details to transfer solana:
- **to** (string): The recipient's Solana address
- **mint** (string): Mint address of the token to transfer (if sol then use SOL) else use the mint address of the token from wallet info
- **amount** (string): Amount of the token to transfer

Provide the values in the following JSON format:

\`\`\`json
{
    "vaultId": {{vaultId}},
    "to": "<to_address>",
    "mint": "<mint_address>",
    "amount": "<amount>",
}
\`\`\`

`;

export const solanaSwapTemplate = `
Here are the recent user messages for context:
{{recentMessages}}

Here is the wallet information:
{{walletInfo}}

Here are mint addresses of the tokens from wallet info:
{{mintAddresses}}

Here is the vault id: {{vaultId}}

Extract the following details to swap tokens:
- **fromMint** (string): Mint of the token to swap from (if sol then use SOL) else use the mint address of the token from wallet info
- **toMint** (string): Mint of the token to swap to (if sol then use SOL) else use the mint address of the token from wallet info
- **amount** (string): Amount of the token to swap
- **slippage** (number): Slippage percentage (default 10%)
- **vaultId** (string): ID of the vault to swap from

Provide the values in the following JSON format:

\`\`\`json
{
    "fromMint": "<from_mint>",
    "toMint": "<to_mint>",
    "amount": "<amount>",
    "slippage": "<slippage>",
    "vaultId": {{vaultId}}
}
\`\`\`

`;
