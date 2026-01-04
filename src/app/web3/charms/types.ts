/**
 * Charms Protocol Type Definitions
 * 
 * Types for interacting with Charms protocol on Bitcoin
 */

export interface CharmsApp {
  name: string;
  appId: string;
  address: string;
  network: 'mainnet' | 'testnet' | 'regtest';
}

export interface CharmsToken {
  tokenId: string;
  appId: string;
  amount: number;
  metadata?: TokenMetadata;
}

export interface CharmsNFT {
  nftId: string;
  appId: string;
  owner: string;
  metadata: NFTMetadata;
  state?: Record<string, any>;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  decimals?: number;
}

export interface NFTMetadata {
  name: string;
  description?: string;
  image?: string;
  attributes?: NFTAttribute[];
  properties?: Record<string, any>;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface Spell {
  spellId: string;
  appId: string;
  type: 'transfer' | 'mint' | 'burn' | 'update_state' | 'custom';
  data: Record<string, any>;
  witness?: string;
}

export interface CharmsAppState {
  appId: string;
  tokens: CharmsToken[];
  nfts: CharmsNFT[];
  state: Record<string, any>;
}

export interface CharmsTransaction {
  txid: string;
  appId: string;
  type: 'token_transfer' | 'nft_mint' | 'nft_transfer' | 'spell_execution';
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  timestamp: number;
}

export interface CharmsWallet {
  address: string;
  publicKey: string;
  network: 'mainnet' | 'testnet' | 'regtest';
}

