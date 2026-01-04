/**
 * Charms Protocol Utilities
 * 
 * Utility functions for Charms protocol integration
 */

import { CharmsNFT, NFTMetadata, TokenMetadata } from './types';

/**
 * Create game reward NFT metadata
 */
export function createGameRewardNFTMetadata(
  level: number,
  rewardType: 'level_pass' | 'treasure' | 'achievement',
  imageUrl?: string
): NFTMetadata {
  const baseMetadata: NFTMetadata = {
    name: `${rewardType === 'level_pass' ? 'Level' : rewardType === 'treasure' ? 'Treasure' : 'Achievement'} ${level}`,
    description: `Reward for completing level ${level} in SolGame`,
    image: imageUrl || `/assets/rewards/${rewardType}_${level}.png`,
    attributes: [
      {
        trait_type: 'Level',
        value: level,
      },
      {
        trait_type: 'Type',
        value: rewardType,
      },
      {
        trait_type: 'Game',
        value: 'SolGame',
      },
    ],
  };

  return baseMetadata;
}

/**
 * Create game token metadata
 */
export function createGameTokenMetadata(
  symbol: string,
  name: string,
  description?: string
): TokenMetadata {
  return {
    name,
    symbol,
    description: description || `${name} token for SolGame`,
    decimals: 9,
  };
}

/**
 * Format NFT for display
 */
export function formatNFTForDisplay(nft: CharmsNFT): {
  id: string;
  name: string;
  image?: string;
  description?: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
} {
  return {
    id: nft.nftId,
    name: nft.metadata.name,
    image: nft.metadata.image,
    description: nft.metadata.description,
    attributes: nft.metadata.attributes,
  };
}

/**
 * Validate Bitcoin address format
 */
export function isValidBitcoinAddress(address: string): boolean {
  // Basic validation - in production, use a proper Bitcoin address validator
  // This checks for common address formats
  const patterns = [
    /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Legacy addresses
    /^bc1[a-z0-9]{39,59}$/i, // Bech32 addresses
    /^bc1p[a-z0-9]{58}$/i, // Bech32m addresses (Taproot)
  ];

  return patterns.some((pattern) => pattern.test(address));
}

/**
 * Shorten Bitcoin address for display
 */
export function shortenBitcoinAddress(
  address: string,
  chars: number = 6
): string {
  if (address.length <= chars * 2) {
    return address;
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Convert satoshis to BTC
 */
export function satoshisToBTC(satoshis: number): number {
  return satoshis / 100000000;
}

/**
 * Convert BTC to satoshis
 */
export function btcToSatoshis(btc: number): number {
  return Math.floor(btc * 100000000);
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransactionConfirmation(
  txid: string,
  maxConfirmations: number = 6,
  checkInterval: number = 5000
): Promise<{ confirmed: boolean; confirmations: number }> {
  // This is a placeholder - actual implementation would query Bitcoin network
  // For now, simulate waiting
  return new Promise((resolve) => {
    let confirmations = 0;
    const interval = setInterval(() => {
      confirmations++;
      if (confirmations >= maxConfirmations) {
        clearInterval(interval);
        resolve({ confirmed: true, confirmations });
      }
    }, checkInterval);
  });
}

