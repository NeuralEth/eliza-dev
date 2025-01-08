import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    elizaLogger,
} from "@elizaos/core";

import { initWalletProvider } from "../providers/wallet";

export const solanaBalanceAction: Action = {
    name: "SOLANA_BALANCE",
    description: "Get the emblem vault balances",
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.info("Message", _message);
        return true;
    },
    similes: [
        "SOLANA_BALANCE",
        "SOLANA_BALANCE_OF_VAULT",
        "SOLANA_BALANCE_OF_WALLET",
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
            const balance = await provider.solanaBalance(provider.info.address);

            if (callback) {
                callback({
                    text: `Address: ${provider.info.address}\nYour vault balances are as follows:

SOL - ${balance.data.solBalance.sol} SOL

Tokens:
${balance.data.tokens
    .map(
        (token) =>
            `- ${token.market_data.name} (${token.market_data.symbol}): ${token.balance}`
    )
    .join("\n")}
`,
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Failed to get solana balance", error);
            if (callback) {
                callback({
                    text: `Error fetching balance: ${error.message}`,
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
                    text: "What is my balance?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Your Solana balance for <address> is as follows:

SOL - 0.05 SOL

Tokens:
- USDC (USDC): 55 USDC`,
                },
            },
        ],
    ],
};
