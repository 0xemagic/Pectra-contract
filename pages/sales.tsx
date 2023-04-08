import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Link,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

import {
    RiTwitterFill,
    RiGithubFill,
} from "react-icons/ri";
import { HiSun, HiMoon } from "react-icons/hi";
import { FaDiscord } from "react-icons/fa";
import { SiMedium } from "react-icons/si";
import { useRouter } from "next/router";
import Front from "../components/sales/front";
import { NextSeo } from "next-seo";

interface LayoutProps {
    children: JSX.Element;
}

export function Layout({ children }: LayoutProps) {
    const { colorMode, toggleColorMode } = useColorMode();
    const links = [
        {
            icon: (
                <RiTwitterFill
                    color={colorMode === "dark" ? "#FFFFFF" : "222222"}
                    size="32px"
                />
            ),
            href: "https://twitter.com/spectra_protocol",
        },
        {
            icon: (
                <SiMedium
                    color={colorMode === "dark" ? "#FFFFFF" : "222222"}
                    size="32px"
                />
            ),
            href: "https://medium.com/@spectra_protocol",
        },
        {
            icon: (
                <FaDiscord
                    color={colorMode === "dark" ? "#FFFFFF" : "222222"}
                    size="32px"
                />
            ),
            href: " https://discord.gg/RKNRDVeFwG",
        },
        {
            icon: (
                <RiGithubFill
                    color={colorMode === "dark" ? "#FFFFFF" : "222222"}
                    size="32px"
                />
            ),
            href: "https://github.com/spectra-protocol",
        },
    ];

    const router = useRouter();

    return (
        <Flex
            minH={"100vh"}
            h="full"
            bg={
 colorMode === "dark"
                        ? "linear-gradient(180deg, #0C1506 0%, #151D10 100%)"
                        : "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)"
            }
            direction="column"
            pb="4rem"
        >
            <Flex
                position="absolute"
                top={0}
                justifyContent="space-between"
                py="3rem"
                px={{ base: "2rem", md: "4rem" }}
                h="56px"
                alignItems="center"
                pos="sticky"
                zIndex="popover"
                w="98vw"
            >
                <Flex onClick={() => router.push("/")} _hover={{ cursor: "pointer" }}>
                    <Image src="/icons/spectra.svg" alt="spectra-protocol-logo" h="2.25rem" />
                    <Heading
                        display={{base: "none", md: "flex"}}
                        ml="1rem"
                        variant="heading"
                        fontSize={{ base: "2rem", md: "2.25rem" }}
                    >
                        PECTRA
                    </Heading>
                </Flex>
                <Flex
                    w="fit-content"
                    justifyContent="space-between"
                >
                    <Flex
                        display={{ base: "none", md: "flex" }}
                        justifySelf="center"
                        alignSelf="center"
                        align="center"
                        justify="center"
                        m="auto"
                        mr="1rem"
                    >
                        {links.map((link) => {
                            return (
                                <Link
                                    href={link.href}
                                    key={link.href}
                                    isExternal
                                    mt="0.5rem"
                                    mr="0.5rem"
                                >
                                    <Flex
                                        w="3.5rem"
                                        h="3.5rem"
                                        bg={
                                         colorMode === "dark"
                                                    ? "#22291C"
                                                    : "#F5F5F5"
                                        }
                                        alignItems={"center"}
                                        justifyContent="center"
                                        borderRadius="12px"
                                        _hover={{
                                            bg: colorMode === "dark"
                                                ? "#2C3327"
                                                : ""
                                        }}
                                    >
                                        {link.icon}
                                    </Flex>
                                </Link>
                            );
                        })}
                    </Flex>

                    <Flex alignItems="center" alignContent={{base: "end", md: "center"}}>
                        <Button mr="1rem" variant="ghost" onClick={toggleColorMode}>
                            {colorMode === "dark" ? <HiSun /> : <HiMoon />}
                        </Button>
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
                            <Button display={{base: "none", md: "block"}} ml="1rem" mr="0.5rem" variant="secondary">LEARN MORE</Button>
                            <Button  display={{base: "none", md: "block"}} variant="secondary">SALES DECK</Button>
                    </Flex>
                </Flex>
            </Flex>
            <Box
                maxW="100vw"
                position={"relative"}
                overflowX="hidden"
                overflowY="auto"
            >
                {children}
            </Box>
        </Flex>
    );
}

function Sales() {
    return (
        <>
        <NextSeo
        title="Pectra Public Sale"
        description="Public sale of $PECTRA token."
        openGraph={{
          title: "Pectra Protocol",
          description: "Pair trading made easy.",
          images: [
            {
              url: "https://www.spectra.garden/spectra-protocol.svg",
              width: 800,
              height: 600,
              alt: "Pectra Protocol",
            },
          ],
        }}
      />
        <Layout>
            <Front />
        </Layout>
        </>
    )
}

export default Sales;