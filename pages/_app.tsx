import "@/styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import Fonts from "../styles/fonts";
import "@fontsource/inter";
import "@fontsource/inter/variable-full.css";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { createClient, configureChains } from "wagmi";
import { WagmiConfig } from "wagmi";
import { arbitrum } from '@wagmi/chains'
import { publicProvider } from "wagmi/providers/public";

import Layout from "../components/layout";

export const { chains, provider, webSocketProvider } = configureChains(
  [arbitrum],
  [
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Pectra Protocol",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
            <WagmiConfig client={wagmiClient}>
      <Fonts />
      <Layout chains={chains}>
      <Component {...pageProps} />
      </Layout>
      </WagmiConfig>
    </ChakraProvider>
  );
}
