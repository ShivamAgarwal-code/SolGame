/**
 * Charms Integration Examples
 * 
 * Example components showing how to integrate Charms protocol
 * into SolGame for tokens and NFTs
 */

import React, { useEffect, useState } from 'react';
import { useCharms } from './index';
import {
  createGameRewardNFTMetadata,
  createGameTokenMetadata,
  formatNFTForDisplay,
} from './utils';
import { CharmsNFT } from './types';

/**
 * Example: Mint Level Pass NFT after completing a level
 */
export const MintLevelPassExample: React.FC<{
  level: number;
  playerAddress: string;
  onMintComplete?: (nft: CharmsNFT) => void;
}> = ({ level, playerAddress, onMintComplete }) => {
  const { mintNFT, isLoading, error } = useCharms();
  const [minted, setMinted] = useState(false);

  const handleMint = async () => {
    const metadata = createGameRewardNFTMetadata(level, 'level_pass');
    const nft = await mintNFT(
      playerAddress,
      metadata,
      {
        level,
        completed: true,
        timestamp: Date.now(),
        game: 'SolGame',
      }
    );

    if (nft) {
      setMinted(true);
      onMintComplete?.(nft);
    }
  };

  if (minted) {
    return <div>Level {level} pass minted successfully!</div>;
  }

  return (
    <div>
      <button onClick={handleMint} disabled={isLoading}>
        {isLoading ? 'Minting...' : `Mint Level ${level} Pass`}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
};

/**
 * Example: Mint game tokens as rewards
 */
export const MintTokenRewardExample: React.FC<{
  amount: number;
  onMintComplete?: () => void;
}> = ({ amount, onMintComplete }) => {
  const { mintToken, isLoading, error } = useCharms();

  const handleMint = async () => {
    const metadata = createGameTokenMetadata(
      'DUN',
      'Dungeon Token',
      'Reward token for SolGame'
    );
    const token = await mintToken(amount, metadata);

    if (token) {
      onMintComplete?.();
    }
  };

  return (
    <div>
      <button onClick={handleMint} disabled={isLoading}>
        {isLoading ? 'Minting...' : `Mint ${amount} DUN Tokens`}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
};

/**
 * Example: Display player's NFT collection
 */
export const PlayerNFTCollectionExample: React.FC<{
  playerAddress: string;
}> = ({ playerAddress }) => {
  const { getOwnedNFTs, isLoading } = useCharms();
  const [nfts, setNfts] = useState<CharmsNFT[]>([]);

  useEffect(() => {
    const loadNFTs = async () => {
      const ownedNFTs = await getOwnedNFTs(playerAddress);
      setNfts(ownedNFTs);
    };
    loadNFTs();
  }, [playerAddress, getOwnedNFTs]);

  if (isLoading) {
    return <div>Loading NFTs...</div>;
  }

  if (nfts.length === 0) {
    return <div>No NFTs found</div>;
  }

  return (
    <div>
      <h3>Your NFT Collection ({nfts.length})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {nfts.map((nft) => {
          const formatted = formatNFTForDisplay(nft);
          return (
            <div key={nft.nftId} style={{ border: '1px solid #ccc', padding: '1rem' }}>
              <h4>{formatted.name}</h4>
              {formatted.image && (
                <img src={formatted.image} alt={formatted.name} style={{ width: '100%' }} />
              )}
              {formatted.description && <p>{formatted.description}</p>}
              {formatted.attributes && (
                <div>
                  {formatted.attributes.map((attr, idx) => (
                    <div key={idx}>
                      <strong>{attr.trait_type}:</strong> {attr.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Example: Game state display with Charms integration
 */
export const GameStateWithCharmsExample: React.FC = () => {
  const { appState, getAppState, isLoading } = useCharms();

  useEffect(() => {
    getAppState();
  }, [getAppState]);

  if (isLoading) {
    return <div>Loading game state...</div>;
  }

  return (
    <div>
      <h3>Game State (Charms)</h3>
      <div>
        <p>Total Tokens: {appState?.tokens.length || 0}</p>
        <p>Total NFTs: {appState?.nfts.length || 0}</p>
        {appState?.state && (
          <div>
            <h4>App State:</h4>
            <pre>{JSON.stringify(appState.state, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Example: Initialize Charms app on component mount
 */
export const CharmsInitializerExample: React.FC<{
  appName: string;
  appId: string;
  children: React.ReactNode;
}> = ({ appName, appId, children }) => {
  const { initializeApp, isInitialized, isLoading, error } = useCharms();

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initializeApp(appName, appId);
    }
  }, [isInitialized, isLoading, initializeApp, appName, appId]);

  if (isLoading) {
    return <div>Initializing Charms app...</div>;
  }

  if (error) {
    return (
      <div>
        <div style={{ color: 'red' }}>Error: {error}</div>
        <button onClick={() => initializeApp(appName, appId)}>Retry</button>
      </div>
    );
  }

  if (!isInitialized) {
    return <div>Not initialized</div>;
  }

  return <>{children}</>;
};

