import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter";
import "@fontsource/inter/variable-full.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import Fonts from "../styles/fonts";
import theme from "../styles/theme";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { arbitrum } from "@wagmi/chains";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { alchemyProvider } from "wagmi/providers/alchemy";
import Layout from "../components/layout";

export const { chains, provider, webSocketProvider } = configureChains(
  [arbitrum],
  typeof process.env.NEXT_PUBLIC_ALCHEMY_API_KEY === "string"
    ? [
        alchemyProvider({
          apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
        }),
        publicProvider(),
      ]
    : [publicProvider()]
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
