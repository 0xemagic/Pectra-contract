import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import {
  lightTheme,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import {
  RiInstagramFill,
  RiTwitterFill,
  RiTelegramFill,
  RiGithubFill,
} from "react-icons/ri";
import { FaDiscord } from "react-icons/fa";
import { SiMedium } from "react-icons/si";
import { useRouter } from "next/router";

interface LayoutProps {
  children: JSX.Element;
  chains: any;
}

export default function Layout({ chains, children }: LayoutProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  const links = [
    {
      icon: <RiInstagramFill color="#FFFFFF" size="32px" />,
      href: "https://www.instagram.com/spectraprotocol/",
    },
    {
      icon: <RiTwitterFill color="#FFFFFF" size="32px" />,
      href: "https://twitter.com/spectraprotocol",
    },
    {
      icon: <RiTelegramFill color="#FFFFFF" size="32px" />,
      href: "https://t.me/spectraprotocol",
    },
    {
      icon: <SiMedium color="#FFFFFF" size="32px" />,
      href: "https://medium.com/spectra-protocol",
    },
    {
      icon: <FaDiscord color="#FFFFFF" size="32px" />,
      href: "https://discord.gg/2Z8Y4Z4",
    },
    {
      icon: <RiGithubFill color="#FFFFFF" size="32px" />,
      href: "https://github.com/spectra-protocol",
    },
  ];

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
      <Flex
        minH={"100vh"}
        h="full"
        bg={router.pathname =='/'? "linear-gradient(180deg, #0C1506 0%, #151D10 100%)" : "#101010"}
        direction="column"
      >
        <Flex
          position="absolute"
          top={0}
          justifyContent="space-between"
          py="3rem"
          px={{base:"2rem", md: "4rem"}}
          h="56px"
          alignItems="center"
          pos="sticky"
          zIndex="popover"
          w="98vw"
        >
          <Flex onClick={() => router.push("/")} _hover={{cursor: "pointer"}}>
            <Image src="/icons/spectra.svg" alt="spectra-protocol-logo" />
            <Heading ml="1rem" variant="heading">
              PECTRA
            </Heading>
          </Flex>

          <Flex display={{base: "none", md: "flex"}} justifySelf={router.pathname === "/" ? "center" : "end"}>
            {links.map((link) => {
              return (
                <Link href={link.href} key={link.href} isExternal mt="0.5rem">
                  <Flex
                    w="3.5rem"
                    h="3.5rem"
                    bg="#21281C"
                    alignItems={"center"}
                    justifyContent="center"
                    borderRadius="12px"
                    _hover={{ bg: "#2C3327" }}
                  >
                    {link.icon}
                  </Flex>
                </Link>
              );
            })}
          </Flex>

          <Flex alignItems="center">
            {/* <Button mr="1rem" variant="ghost" onClick={toggleColorMode}>
              {colorMode === "dark" ? <HiSun /> : <HiMoon />}
            </Button> */}
            {router.pathname === "/" ? (
              <Button variant="primary" onClick={() => router.push("/trade")}>ENTER</Button>
            ) : (
              <ConnectButton
                chainStatus={"none"}
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
              />
            )}
          </Flex>
        </Flex>
        <Box w="full">{children}</Box>
        <Flex display={{base: "flex", md: "none"}} gap="0.5rem" alignSelf="start" px={{base: "2rem", md: "4rem"}}>
            {links.map((link) => {
              return (
                <Link href={link.href} key={link.href} isExternal>
                  <Flex
                    w="3rem"
                    h="3rem"
                    bg="#21281C"
                    alignItems={"center"}
                    justifyContent="center"
                    borderRadius="12px"
                    _hover={{ bg: "#2C3327" }}
                  >
                    {link.icon}
                  </Flex>
                </Link>
              );
            })}
          </Flex>
      </Flex>
    </RainbowKitProvider>
  );
}
