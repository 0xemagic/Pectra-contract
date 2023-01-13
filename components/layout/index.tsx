import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import {
  lightTheme,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { HiMoon, HiSun } from "react-icons/hi";

interface LayoutProps {
  children: JSX.Element;
  chains: any;
}

export default function Layout({ chains, children }: LayoutProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <RainbowKitProvider
      chains={chains}
      showRecentTransactions={true}
      theme={
        colorMode === "light"
          ? lightTheme({
              accentColor: "brand",
            })
          : darkTheme({
              accentColor: "brand",
            })
      }
    >
      <Box minH={"100vh"} h="full">
        <Flex
          position="absolute"
          top={0}
          justifyContent="space-between"
          p="16px"
          h="56px"
          alignItems="center"
          pos="sticky"
          zIndex="popover"
        >
          <Flex>
            <Image src="/icons/spectra.svg" alt="spectra-protocol-logo" />
            <Heading ml="1rem" variant="heading">
              PECTRA
            </Heading>
          </Flex>

          <Flex           alignItems="center">
            <Button mr="1rem" variant="ghost" onClick={toggleColorMode}>
              {colorMode === "dark" ? <HiSun /> : <HiMoon />}
            </Button>
            <ConnectButton
              chainStatus={"none"}
            //   showBalance={{
            //     smallScreen: false,
            //     largeScreen: true,
            //   }}
            //   accountStatus={{
            //     smallScreen: "avatar",
            //     largeScreen: "full",
            //   }}
            />
          </Flex>
        </Flex>
        <Box w="full">{children}</Box>
      </Box>
    </RainbowKitProvider>
  );
}
