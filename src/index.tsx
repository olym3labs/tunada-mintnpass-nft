import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { base,
  //mainnet,  sepolia, baseSepolia, holesky 
} from 'viem/chains';
import { WagmiProvider, createConfig, CreateConnectorFn, http } from 'wagmi';
import { Buffer } from 'buffer';
import { metaMask } from 'wagmi/connectors';
import { safe } from 'wagmi/connectors';
//import { injected } from 'wagmi/connectors';
import { walletConnect } from 'wagmi/connectors';

import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// polyfill Buffer for client
if (!window.Buffer) {
  window.Buffer = Buffer;
}

const WALLETCONNECT_PROJECT_ID = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID;

let connectors: CreateConnectorFn[] = [safe(), metaMask()];

if (WALLETCONNECT_PROJECT_ID) {
  // A WalletConnect ID is provided so we add the Connector for testing purposes
  connectors = [...connectors, walletConnect({ projectId: WALLETCONNECT_PROJECT_ID })];
}

const queryClient = new QueryClient();
const config = createConfig({
  connectors,
  chains: [base, 
    //mainnet, sepolia, baseSepolia, holesky
  ],
  transports: {
    //[mainnet.id]: http("https://ethereum-rpc.publicnode.com"),
    [base.id]: http("https://base-rpc.publicnode.com"),
    //[sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"),
    //[baseSepolia.id]: http("https://base-sepolia-rpc.publicnode.com"),
    //[holesky.id]: http("https://ethereum-holesky-rpc.publicnode.com"),
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);

reportWebVitals();
