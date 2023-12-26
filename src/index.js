import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  fantom,
  fuse,
  bsc,
  avalanche,
  polygonMumbai,
} from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    fantom,
    fuse,
    bsc,
    avalanche,
    polygonMumbai,
  ],
  [publicProvider()]
);

export const getDefaultWallets = ({ appName, projectId, chains }: any) => {
  const connectors = [
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName,
        //@ts-ignore
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        //@ts-ignore
        qrcode: true,
        shimDisconnect: true,
      },
    }),
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
  ];
  return { connectors };
};

const { connectors } = getDefaultWallets({
  appName: "Customer App powered by Tria",
  projectId: "bd38d3892c8fd8bc9dabf6fced0bd3c6",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WagmiConfig config={wagmiConfig}>
    <App />
  </WagmiConfig>
);

