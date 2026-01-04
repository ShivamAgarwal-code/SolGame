/**
 * Charms Provider
 * 
 * React context provider for Charms protocol integration
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { CharmsClient } from './client';
import {
  CharmsApp,
  CharmsToken,
  CharmsNFT,
  CharmsAppState,
  CharmsTransaction,
  NFTMetadata,
  TokenMetadata,
} from './types';

interface CharmsContextType {
  client: CharmsClient | null;
  app: CharmsApp | null;
  appState: CharmsAppState | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Methods
  initializeApp: (appName: string, appId: string) => Promise<void>;
  mintToken: (amount: number, metadata?: TokenMetadata) => Promise<CharmsToken | null>;
  mintNFT: (owner: string, metadata: NFTMetadata, state?: Record<string, any>) => Promise<CharmsNFT | null>;
  transferToken: (tokenId: string, to: string, amount: number) => Promise<CharmsTransaction | null>;
  transferNFT: (nftId: string, to: string) => Promise<CharmsTransaction | null>;
  getAppState: () => Promise<void>;
  getOwnedNFTs: (address: string) => Promise<CharmsNFT[]>;
  updateNFTState: (nftId: string, state: Record<string, any>) => Promise<CharmsTransaction | null>;
}

const CharmsContext = createContext<CharmsContextType>({} as CharmsContextType);

export const useCharms = () => useContext(CharmsContext);

interface CharmsProviderProps {
  children: ReactNode;
  network?: 'mainnet' | 'testnet' | 'regtest';
  rpcUrl?: string;
}

export const CharmsProvider: React.FC<CharmsProviderProps> = ({
  children,
  network = 'testnet',
  rpcUrl,
}) => {
  const [client, setClient] = useState<CharmsClient | null>(null);
  const [app, setApp] = useState<CharmsApp | null>(null);
  const [appState, setAppState] = useState<CharmsAppState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeApp = useCallback(
    async (appName: string, appId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const charmsClient = new CharmsClient(appId, network, rpcUrl);
        const initializedApp = await charmsClient.initializeApp(appName);

        setClient(charmsClient);
        setApp(initializedApp);
        setIsInitialized(true);

        // Load initial app state
        const state = await charmsClient.getAppState();
        setAppState(state);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Charms app';
        setError(errorMessage);
        console.error('Error initializing Charms app:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [network, rpcUrl]
  );

  const mintToken = useCallback(
    async (amount: number, metadata?: TokenMetadata): Promise<CharmsToken | null> => {
      if (!client) {
        setError('Charms client not initialized');
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);
        const token = await client.mintToken(amount, metadata);
        
        // Refresh app state
        const state = await client.getAppState();
        setAppState(state);
        
        return token;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to mint token';
        setError(errorMessage);
        console.error('Error minting token:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  const mintNFT = useCallback(
    async (
      owner: string,
      metadata: NFTMetadata,
      state?: Record<string, any>
    ): Promise<CharmsNFT | null> => {
      if (!client) {
        setError('Charms client not initialized');
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);
        const nft = await client.mintNFT(owner, metadata, state);
        
        // Refresh app state
        const appState = await client.getAppState();
        setAppState(appState);
        
        return nft;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to mint NFT';
        setError(errorMessage);
        console.error('Error minting NFT:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  const transferToken = useCallback(
    async (
      tokenId: string,
      to: string,
      amount: number
    ): Promise<CharmsTransaction | null> => {
      if (!client) {
        setError('Charms client not initialized');
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);
        const transaction = await client.transferToken(tokenId, to, amount);
        
        // Refresh app state
        const state = await client.getAppState();
        setAppState(state);
        
        return transaction;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to transfer token';
        setError(errorMessage);
        console.error('Error transferring token:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  const transferNFT = useCallback(
    async (nftId: string, to: string): Promise<CharmsTransaction | null> => {
      if (!client) {
        setError('Charms client not initialized');
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);
        const transaction = await client.transferNFT(nftId, to);
        
        // Refresh app state
        const state = await client.getAppState();
        setAppState(state);
        
        return transaction;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to transfer NFT';
        setError(errorMessage);
        console.error('Error transferring NFT:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  const getAppState = useCallback(async () => {
    if (!client) {
      setError('Charms client not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const state = await client.getAppState();
      setAppState(state);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get app state';
      setError(errorMessage);
      console.error('Error getting app state:', err);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  const getOwnedNFTs = useCallback(
    async (address: string): Promise<CharmsNFT[]> => {
      if (!client) {
        setError('Charms client not initialized');
        return [];
      }

      try {
        setIsLoading(true);
        setError(null);
        const nfts = await client.getOwnedNFTs(address);
        return nfts;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get owned NFTs';
        setError(errorMessage);
        console.error('Error getting owned NFTs:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  const updateNFTState = useCallback(
    async (
      nftId: string,
      state: Record<string, any>
    ): Promise<CharmsTransaction | null> => {
      if (!client) {
        setError('Charms client not initialized');
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);
        const transaction = await client.updateNFTState(nftId, state);
        
        // Refresh app state
        const appState = await client.getAppState();
        setAppState(appState);
        
        return transaction;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update NFT state';
        setError(errorMessage);
        console.error('Error updating NFT state:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  const value = useMemo<CharmsContextType>(
    () => ({
      client,
      app,
      appState,
      isInitialized,
      isLoading,
      error,
      initializeApp,
      mintToken,
      mintNFT,
      transferToken,
      transferNFT,
      getAppState,
      getOwnedNFTs,
      updateNFTState,
    }),
    [
      client,
      app,
      appState,
      isInitialized,
      isLoading,
      error,
      initializeApp,
      mintToken,
      mintNFT,
      transferToken,
      transferNFT,
      getAppState,
      getOwnedNFTs,
      updateNFTState,
    ]
  );

  return (
    <CharmsContext.Provider value={value}>
      {children}
    </CharmsContext.Provider>
  );
};

