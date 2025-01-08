# @elizaos/plugin-emblem-vault

This plugin provides actions and providers for interacting with Emblem Vault Wallet.

## Description

The Emblem Vault plugin provides comprehensive functionality for interacting with Eblem Vault Wallet

## Features

- Query your solana and token balances
- Transfer sol to other wallet addresses
- Swap tokens

## Installation

```bash
pnpm install @elizaos/plugin-emblem-vault
```

## Configuration

### Required Environment Variables

```env
# Required
EMBLEM_VAULT_API_KEY=your-api-key-here
```

### Configuration

```json
"settings": {
    "secrets": {
        "EMBLEM_VAULT_API_KEY": "your-api-key-here"
    }
}
```

**Example usage:**

```env
EMBLEM_VAULT_API_KEY=your-api-key-here
```

## Actions

### 1. Solana Balance

Query your solana and token balances:

```typescript
// Example: Query your solana and token balances
- What is my vault balance?
- What is balance of USDC?
```

### 2. Solana Transfer

Transfer sol to other wallet addresses:

```typescript
// Example: Transfer sol to other wallet addresses
Transfer 1 SOL to 8ocp6g6BqyAn8gbjtQYJubtbkh1sU1ZMUXudKU3i7zFf
```

### 3. Solana Swap

Swap tokens on the same chain using LiFi:

```typescript
Swap 1 LFG for USDC
```

## Development

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Build the plugin:

```bash
pnpm run build
```

## License

This plugin is part of the Eliza project. See the main project repository for license information.
