import type { Plugin } from "@elizaos/core";
import { solanaBalanceAction } from "./actions/solanaBalance";
import { solanaTransferAction } from "./actions/solanaTransfer";
import { solanaSwapAction } from "./actions/solanaSwap";
import { emblemVaultWalletProvider } from "./providers/wallet";

export const emblemVaultPlugin: Plugin = {
    name: "emblem-vault",
    description: "Emblem Vault integration plugin",
    providers: [emblemVaultWalletProvider],
    actions: [solanaBalanceAction, solanaTransferAction, solanaSwapAction],
    services: [],
    evaluators: [],
    clients: [],
};

export default emblemVaultPlugin;
