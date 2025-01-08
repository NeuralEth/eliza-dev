import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    composeContext,
    elizaLogger,
    generateObject,
} from "@elizaos/core";
import { initWalletProvider } from "../providers/wallet";
import { solanaSwapTemplate } from "../templates";
import { SolanaSwapRequestSchema, isSolanaSwapRequest } from "../types";

export const solanaSwapAction: Action = {
    name: "SOLANA_SWAP",
    description: "Swap SOL or tokens from your emblem vault to another token",
    validate: async (_runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.info("Message", message);
        return true;
    },
    similes: [
        "SWAP_SOLANA",
        "SWAP_SOL",
        "SOL_SWAP",
        "SWAP_TOKENS",
        "TOKENS_SWAP",
    ],
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: unknown,
        callback: HandlerCallback
    ) => {
        try {
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }

            const provider = await initWalletProvider(runtime);
            const balance = await provider.solanaBalance(
                provider.info.solanaAddress
            );

            const mintAddresses = balance.tokens.map(
                (token) =>
                    `Name: ${token.market_data.name}, Mint: ${token.mint}, Symbol: ${token.market_data.symbol}`
            );
            mintAddresses.push(`Name: SOL, Mint: SOL, Symbol: SOL`);
            state.mintAddresses = mintAddresses.join("\n");
            state.walletInfo = balance;
            state.vaultId = provider.info.vaultId;

            const context = composeContext({
                state,
                template: solanaSwapTemplate,
            });
            const request = await generateObject({
                runtime,
                context,
                modelClass: ModelClass.LARGE,
                schema: SolanaSwapRequestSchema,
            });

            if (!isSolanaSwapRequest(request.object)) {
                if (callback) {
                    callback({
                        text: "I need to know the to address, mint token and amount",
                    });
                }
                return false;
            }

            const swap = await provider.solanaSwap({
                vaultId: request.object.vaultId,
                fromMint: request.object.fromMint,
                toMint: request.object.toMint,
                amount: request.object.amount,
                slippage: request.object.slippage,
            });

            if (callback) {
                callback({
                    text: `Swap of ${request.object.amount} ${request.object.fromMint} to ${request.object.toMint} completed successfully.\n Transaction Hash: ${swap.fromRemoteSigner.signedTransaction.transactionSignature}`,
                    content: {
                        success: true,
                        hash: swap.fromRemoteSigner.signedTransaction
                            .transactionSignature,
                        amount: request.object.amount,
                        fromMint: request.object.fromMint,
                        toMint: request.object.toMint,
                    },
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Failed to swap from vault", error);
            if (callback) {
                callback({
                    text: `Error swapping from vault: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Swap 10 SOL to USDC",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Swap of 10 SOL to USDC completed successfully. Tx hash: 1234567890`,
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Swap 10 SOL to USDC",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Swap of 10 SOL to USDC completed successfully. Tx hash: 1234567890`,
                },
            },
        ],
    ],
};
