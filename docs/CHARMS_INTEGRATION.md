# Charms Protocol Integration Guide

This guide explains how to integrate and use the Charms protocol in SolGame.

## Overview

Charms is a protocol for building custom apps on Bitcoin, integrated with Grail Pro for zkBTC. It enables programmable tokens and NFTs with app state management using spells in Taproot witnesses.

**Documentation**: https://docs.bitcoinos.build/technical-documentation/grail-pro-charms-zkbtc/technical-overview/charms/charms-development-integration

## Installation

### Prerequisites

- Rust (latest stable version)
- Cargo package manager
- Bitcoin node (for mainnet/testnet) or local regtest node

### Install Charms CLI

```bash
cargo install --locked Charms
```

Verify installation:
```bash
Charms --version
```

## Creating a Charms App

### Initialize a New App

```bash
cd charms-apps
Charms app new solgame-tokens
```

This creates a new Charms app structure that you can customize for your game tokens and NFTs.

## Integration in SolGame

### 1. Setup Charms Provider

Wrap your app with the `CharmsProvider`:

```tsx
import { CharmsProvider } from './app/web3/charms';

function App() {
  return (
    <CharmsProvider network="testnet">
      {/* Your app components */}
    </CharmsProvider>
  );
}
```

### 2. Initialize the App

```tsx
import { useCharms } from './app/web3/charms';

function GameComponent() {
  const { initializeApp, isInitialized } = useCharms();

  useEffect(() => {
    if (!isInitialized) {
      initializeApp('SolGame', 'solgame-app-id');
    }
  }, [isInitialized, initializeApp]);

  // ...
}
```

### 3. Mint Game Tokens

```tsx
import { useCharms } from './app/web3/charms';
import { createGameTokenMetadata } from './app/web3/charms/utils';

function MintTokens() {
  const { mintToken } = useCharms();

  const handleMint = async () => {
    const metadata = createGameTokenMetadata('DUN', 'Dungeon Token', 'Game token for SolGame');
    const token = await mintToken(1000, metadata);
    console.log('Minted token:', token);
  };

  return <button onClick={handleMint}>Mint Tokens</button>;
}
```

### 4. Mint Game NFTs (Level Passes)

```tsx
import { useCharms } from './app/web3/charms';
import { createGameRewardNFTMetadata } from './app/web3/charms/utils';

function MintLevelPass() {
  const { mintNFT } = useCharms();

  const handleMintLevelPass = async (level: number, ownerAddress: string) => {
    const metadata = createGameRewardNFTMetadata(level, 'level_pass');
    const nft = await mintNFT(ownerAddress, metadata, {
      level,
      completed: true,
      timestamp: Date.now(),
    });
    console.log('Minted level pass NFT:', nft);
  };

  return <button onClick={() => handleMintLevelPass(1, 'user-address')}>Mint Level Pass</button>;
}
```

### 5. Query App State

```tsx
import { useCharms } from './app/web3/charms';

function GameState() {
  const { appState, getAppState } = useCharms();

  useEffect(() => {
    getAppState();
  }, [getAppState]);

  return (
    <div>
      <h3>App State</h3>
      <p>Tokens: {appState?.tokens.length || 0}</p>
      <p>NFTs: {appState?.nfts.length || 0}</p>
    </div>
  );
}
```

### 6. Get User's NFTs

```tsx
import { useCharms } from './app/web3/charms';

function UserNFTs({ address }: { address: string }) {
  const { getOwnedNFTs, isLoading } = useCharms();
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const loadNFTs = async () => {
      const userNFTs = await getOwnedNFTs(address);
      setNfts(userNFTs);
    };
    loadNFTs();
  }, [address, getOwnedNFTs]);

  return (
    <div>
      {nfts.map((nft) => (
        <div key={nft.nftId}>
          <h4>{nft.metadata.name}</h4>
          <p>{nft.metadata.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## Architecture

The Charms integration consists of:

1. **Client** (`client.ts`): Core client for interacting with Charms protocol
2. **Provider** (`provider.tsx`): React context provider for state management
3. **Types** (`types.ts`): TypeScript type definitions
4. **Utils** (`utils.ts`): Utility functions for common operations

## Features

### Token Management
- Mint programmable tokens
- Transfer tokens between addresses
- Query token balances

### NFT Management
- Mint NFTs with metadata
- Transfer NFTs
- Update NFT state (for game progression)
- Query owned NFTs

### Spell System
- Execute spells for custom logic
- Use Taproot witnesses for programmability
- Maintain app state

## Network Configuration

The Charms integration supports:
- **mainnet**: Bitcoin mainnet
- **testnet**: Bitcoin testnet (recommended for development)
- **regtest**: Local regtest network (for testing)

## Error Handling

All Charms operations include error handling. Check the `error` state from `useCharms()`:

```tsx
const { error, isLoading } = useCharms();

if (error) {
  console.error('Charms error:', error);
}
```

## Best Practices

1. **Use testnet for development**: Always test on testnet before mainnet
2. **Handle loading states**: Check `isLoading` before showing UI
3. **Error handling**: Always handle errors gracefully
4. **State refresh**: Call `getAppState()` after mutations
5. **Address validation**: Use `isValidBitcoinAddress()` before transfers

## Next Steps

1. Install Charms CLI
2. Create your Charms app
3. Configure network settings
4. Integrate into your game components
5. Test on testnet
6. Deploy to mainnet when ready

## Resources

- [Charms Documentation](https://docs.bitcoinos.build/technical-documentation/grail-pro-charms-zkbtc/technical-overview/charms/charms-development-integration)
- [BitcoinOS Documentation](https://docs.bitcoinos.build/)
- [Grail Pro Documentation](https://docs.bitcoinos.build/technical-documentation/grail-pro-charms-zkbtc/technical-overview/grail-pro)

