import { z } from "zod";

export interface ApiResponse<T> {
    data: T;
    error?: string;
}

export const VaultInfoSchema = z.object({
    vaultId: z.string(),
    solanaAddress: z.string(),
});

export const SolanaTransferRequestSchema = z.object({
    vaultId: z.string().optional(),
    to: z.string(),
    mint: z.string(),
    amount: z.string(),
});

export const SolanaTransferResponseSchema = z.object({
    fromRemoteSigner: z.object({
        signedTransaction: z.object({
            transactionSignature: z.string(),
            serializedSignedTransaction: z.string(),
        }),
    }),
});

export const SolanaBalanceRequestSchema = z.object({
    vaultIdOrAddress: z.string(),
});

export const SolanaBalanceResponseSchema = z.object({
    address: z.string(),
    solBalance: z.object({
        lamports: z.number(),
        sol: z.number(),
    }),
    tokens: z.array(
        z.object({
            mint: z.string(),
            tokenAccount: z.string(),
            balance: z.number(),
            decimals: z.number(),
            market_data: z.object({
                name: z.string(),
                symbol: z.string(),
                decimals: z.number(),
                image_url: z.string(),
                price_usd: z.string(),
                market_cap_usd: z.string(),
                volume_usd_24h: z.string(),
                total_supply: z.string(),
            }),
        })
    ),
});

export const SolanaSwapRequestSchema = z.object({
    fromMint: z.string(),
    toMint: z.string(),
    amount: z.string(),
    slippage: z.number(),
    vaultId: z.string(),
});

export const SolanaSwapResponseSchema = z.object({
    fromRemoteSigner: z.object({
        signedTransaction: z.object({
            transactionSignature: z.string(),
            serializedSignedTransaction: z.string().optional(),
        }),
    }),
});

export type VaultInfo = z.infer<typeof UserInfoSchema>;
export type SolanaTransferRequest = z.infer<typeof SolanaTransferRequestSchema>;
export type SolanaTransferResponse = z.infer<
    typeof SolanaTransferResponseSchema
>;
export type SolanaBalanceRequest = z.infer<typeof SolanaBalanceRequestSchema>;
export type SolanaBalanceResponse = z.infer<typeof SolanaBalanceResponseSchema>;
export type SolanaSwapRequest = z.infer<typeof SolanaSwapRequestSchema>;
export type SolanaSwapResponse = z.infer<typeof SolanaSwapResponseSchema>;

// Type guards
export const isSolanaTransferRequest = (
    obj: unknown
): obj is SolanaTransferRequest => {
    return SolanaTransferRequestSchema.safeParse(obj).success;
};

export const isSolanaTransferResponse = (
    obj: unknown
): obj is SolanaTransferResponse => {
    return SolanaTransferResponseSchema.safeParse(obj).success;
};

export const isSolanaBalanceRequest = (
    obj: unknown
): obj is SolanaBalanceRequest => {
    return SolanaBalanceRequestSchema.safeParse(obj).success;
};

export const isSolanaBalanceResponse = (
    obj: unknown
): obj is SolanaBalanceResponse => {
    return SolanaBalanceResponseSchema.safeParse(obj).success;
};

export const isSolanaSwapRequest = (obj: unknown): obj is SolanaSwapRequest => {
    return SolanaSwapRequestSchema.safeParse(obj).success;
};

export const isSolanaSwapResponse = (
    obj: unknown
): obj is SolanaSwapResponse => {
    return SolanaSwapResponseSchema.safeParse(obj).success;
};

// Plugin configuration type
export interface EmblemVaultPluginConfig {
    apiKey: string;
}
