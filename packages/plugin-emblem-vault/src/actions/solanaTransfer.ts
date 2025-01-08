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
import { solanaTransferTemplate } from "../templates";
import { SolanaTransferRequestSchema, isSolanaTransferRequest } from "../types";

export const solanaTransferAction: Action = {
    name: "SOLANA_TRANSFER",
    description: "Transfer SOL from emblem vault to other solana addresses",
    validate: async (_runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.info("Message", message);
        return true;
    },
    similes: ["TRANSFER_SOLANA", "TRANSFER_SOL", "SOL_TRANSFER"],
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
            const balance = await provider.solanaBalance(provider.info.address);

            const mintAddresses = balance.data.tokens.map(
                (token) =>
                    `Name: ${token.market_data.name}, Mint: ${token.mint}, Symbol: ${token.market_data.symbol}`
            );
            mintAddresses.push(`Name: SOL, Mint: SOL, Symbol: SOL`);
            state.mintAddresses = mintAddresses.join("\n");
            state.walletInfo = balance.data;
            state.vaultId = provider.info.vaultId;

            const context = composeContext({
                state,
                template: solanaTransferTemplate,
            });

            const request = await generateObject({
                runtime,
                context,
                modelClass: ModelClass.LARGE,
                schema: SolanaTransferRequestSchema,
            });

            if (!isSolanaTransferRequest(request.object)) {
                await callback({
                    text: "I need to know the to address, mint token and amount",
                });
                return false;
            }

            const transfer = await provider.solanaTransfer({
                vaultId: request.object.vaultId,
                to: request.object.to,
                mint: request.object.mint,
                amount: request.object.amount,
            });

            if (callback) {
                callback({
                    text: `Successfully transferred ${request.object.amount} tokens to ${request.object.to}\nTransaction Hash: ${transfer.data.fromRemoteSigner.signedTransaction.transactionSignature}`,
                    content: {
                        success: true,
                        hash: transfer.data.fromRemoteSigner.signedTransaction
                            .transactionSignature,
                        amount: request.object.amount,
                        recipient: request.object.to,
                    },
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Failed to transfer", error);
            if (callback) {
                callback({
                    text: `Error transferring: ${error.message}. Please check the logs.`,
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
                    text: "Transfer 10 SOL to 8ocp6g6BqyAn8gbjtQYJubtbkh1sU1ZMUXudKU3i7zFf",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Successfully transferred 10 SOL to <address>\nTransaction Hash: BRSTHuvPgfgdwGgr4wq4VJizD223wnGaxp7LBfqBqEb4Vk694g7G4iGNAUi3uzUQk4jV9A9dvwTLqdYpTsz5W7d`,
                },
            },
        ],
        // TODO: Add USDC transfer example when backend works
        [
            // {
            //     user: "{{user1}}",
            //     content: {
            //         text: "Transfer 10 USDC coin to 8ocp6g6BqyAn8gbjtQYJubtbkh1sU1ZMUXudKU3i7zFf",
            //     },
            // },
            // {
            //     user: "{{agentName}}",
            //     content: {
            //         text: `Transfer of 10 USDC to <address> completed successfully with tx hash: 1234567890`,
            //     },
            // },
        ],
    ],
};
