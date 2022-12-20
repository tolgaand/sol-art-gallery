import { ChakraProvider } from "@chakra-ui/react";
import "@solana/wallet-adapter-react-ui/styles.css";
import "assets/styles/style.scss";
import "react-lazy-load-image-component/src/effects/blur.css";

import type { AppProps } from "next/app";
import { theme } from "theme";

import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  UnsafeBurnerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { DefaultContainer } from "container/Default";
import { GoogleAnalytics } from "nextjs-google-analytics";

// Default styles that can be overridden by your app

export default function App({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <GoogleAnalytics trackPageViews />
              <DefaultContainer>
                <Component {...pageProps} />
              </DefaultContainer>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
