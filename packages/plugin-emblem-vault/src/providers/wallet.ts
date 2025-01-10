import {
    Provider,
    IAgentRuntime,
    Memory,
    State,
    elizaLogger,
} from "@elizaos/core";
import { EmblemVaultApiClient } from "../services/rest";
import {
    ApiResponse,
    SolanaBalanceResponse,
    SolanaSwapRequest,
    SolanaSwapResponse,
    SolanaTransferRequest,
    SolanaTransferResponse,
    VaultInfo,
} from "../types";

export class EmblemVaultWalletProvider {
    private emblemVaultApiClient: EmblemVaultApiClient;
    info: VaultInfo;

    constructor(apiKey: string) {
        elizaLogger.info("Initializing Emblem Vault API client", apiKey);
        this.emblemVaultApiClient = new EmblemVaultApiClient(apiKey);
        this.emblemVaultApiClient.getVaultInfo().then((res) => {
            if (res.error) {
                elizaLogger.error("Error getting vault info", res.error);
                throw new Error(
                    "Failed to initialize Emblem Vault API client. Please check your API key."
                );
            } else {
                this.info = res.data;
                elizaLogger.info("Vault info", res.data);
            }
        });
    }

    async getVaultInfo(): Promise<ApiResponse<VaultInfo>> {
        return await this.emblemVaultApiClient.getVaultInfo();
    }

    async solanaBalance(address: string): Promise<SolanaBalanceResponse> {
        const balance = await this.emblemVaultApiClient.solanaBalance(address);
        if (balance.error) {
            throw new Error(balance.error);
        }
        return balance.data;
    }

    async solanaSwap(request: SolanaSwapRequest): Promise<SolanaSwapResponse> {
        const response = await this.emblemVaultApiClient.solanaSwap(request);
        if (response.error) {
            throw new Error(response.error);
        }
        return response.data;
    }

    async solanaTransfer(
        request: SolanaTransferRequest
    ): Promise<SolanaTransferResponse> {
        const response =
            await this.emblemVaultApiClient.solanaTransfer(request);
        if (response.error) {
            throw new Error(response.error);
        }
        return response.data;
    }
}

export const initWalletProvider = async (runtime: IAgentRuntime) => {
    const apiKey = runtime.getSetting("EMBLEM_VAULT_API_KEY");
    if (!apiKey) {
        throw new Error("EMBLEM_VAULT_API_KEY is missing");
    }
    return new EmblemVaultWalletProvider(apiKey);
};

export const emblemVaultWalletProvider: Provider = {
    async get(_runtime: IAgentRuntime, _message: Memory, _state?: State) {
        return "emblem-vault";
    },
};
