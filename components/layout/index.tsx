import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import {
  ConnectButton,
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { useRouter } from "next/router";
import { FaDiscord } from "react-icons/fa";
import { HiMoon, HiSun } from "react-icons/hi";
import { RiGithubFill, RiTwitterFill } from "react-icons/ri";
import { SiMedium } from "react-icons/si";

interface LayoutProps {
  children: JSX.Element;
  chains: any;
}

export default function Layout({ chains, children }: LayoutProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  const links = [
    // {
    //   icon: (
    //     <RiInstagramFill
    //       color={colorMode === "dark" ? "#FFFFFF" : "222222"}
    //       size="32px"
    //     />
    //   ),
    //   href: "https://www.instagram.com/spectraprotocol/",
    // },
    {
      icon: (
        <RiTwitterFill
          color={colorMode === "dark" ? "#FFFFFF" : "222222"}
          size="32px"
        />
      ),
      href: "https://twitter.com/spectra_protocol",
    },
    // {
    //   icon: (
    //     <RiTelegramFill
    //       color={colorMode === "dark" ? "#FFFFFF" : "222222"}
    //       size="32px"
    //     />
    //   ),
    //   href: "https://t.me/spectraprotocol",
    // },
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

  const pages = [
    {
      href: "/",
      title: "Home",
    },
    {
      href: "/overview",
      title: "Overview",
    },
    {
      href: "/faq",
      title: "FAQ",
    },
    {
      href: "/trade",
      title: "Trade",
    },
  ];

  const isIndex = router.pathname === "/";
  const isSales = router.pathname === "/sales";
  const isToken = router.pathname === "/token";

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
        bg={
          isIndex
            ? colorMode === "dark"
              ? "linear-gradient(180deg, #0C1506 0%, #151D10 100%)"
              : "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)"
            : colorMode === "dark"
            ? "#101010"
            : "#FFFFFF"
        }
        direction="column"
        // pb="4rem"
      >
        {!isSales && (
          <Flex
            w="100%"
            h={12}
            bg="purple.900"
            alignItems={"center"}
            direction="row"
          >
            <HStack margin={"0 auto"} spacing={4}>
              <Text>Pectra token sale is ongoing!</Text>
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => {
                  router.push("/sales");
                }}
              >
                Buy $PECTRA
              </Button>
            </HStack>
          </Flex>
        )}
        <Flex
          display={isSales === true ? "none" : "flex"}
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
              ml="1rem"
              variant="heading"
              fontSize={{ base: "2rem", md: "2.25rem" }}
            >
              PECTRA
            </Heading>
          </Flex>

          <Flex
            display={isIndex || isToken ? "none" : "flex"}
            direction="row"
            justify="space-between"
            align="center"
            w="20%"
            h="100%"
          >
            {pages.map((page, index) => (
              <Link
                display={router.pathname === page.href ? "none" : "inline"}
                key={index}
                href={page.href}
                _hover={{ textDecoration: "none" }}
              >
                <Text
                  _hover={{ borderBottom: "2px #ACE075 solid" }}
                  _focus={{ borderBottom: "2px #ACE075 solid" }}
                  _active={{ borderBottom: "2px #ACE075 solid" }}
                >
                  {page.title}
                </Text>
              </Link>
            ))}
          </Flex>
          <Flex
            w="fit-content"
            justifyContent={isIndex || isToken ? "space-between" : "flex-end"}
          >
            <Flex
              display={{ base: "none", md: "flex" }}
              justifySelf={isIndex || isToken ? "center" : "end"}
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
                        isIndex || isToken
                          ? colorMode === "dark"
                            ? "#22291C"
                            : "#F5F5F5"
                          : "none"
                      }
                      alignItems={"center"}
                      justifyContent="center"
                      borderRadius="12px"
                      _hover={{
                        bg: isIndex
                          ? colorMode === "dark"
                            ? "#2C3327"
                            : ""
                          : colorMode === "dark"
                          ? "#242323"
                          : "",
                      }}
                    >
                      {link.icon}
                    </Flex>
                  </Link>
                );
              })}
            </Flex>

            <Flex alignItems="center">
              <Button mr="1rem" variant="ghost" onClick={toggleColorMode}>
                {colorMode === "dark" ? <HiSun /> : <HiMoon />}
              </Button>
              {router.pathname === "/" ? (
                <>
                  {process.env.NODE_ENV === "development" ? (
                    <Button
                      variant="primary"
                      onClick={() => router.push("/trade")}
                    >
                      ENTER
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      //  onClick={() => router.push("/trade")}
                    >
                      COMING SOON
                    </Button>
                  )}
                </>
              ) : (
                <ConnectButton
                  chainStatus={"none"}
                  showBalance={{
                    smallScreen: false,
                    largeScreen: false,
                  }}
                  accountStatus={{
                    smallScreen: "avatar",
                    largeScreen: "avatar",
                  }}
                />
              )}
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
        {!isIndex && (
          <Flex
            display={{ base: "flex", md: "none" }}
            gap="0.5rem"
            alignSelf="start"
            px={{ base: "2rem", md: "4rem" }}
          >
            {links.map((link) => {
              return (
                <Link href={link.href} key={link.href} isExternal>
                  <Flex
                    w="3rem"
                    h="3rem"
                    bg={
                      isIndex
                        ? colorMode === "dark"
                          ? "#22291C"
                          : "#F5F5F5"
                        : "none"
                    }
                    alignItems={"center"}
                    justifyContent="center"
                    borderRadius="12px"
                    _hover={{
                      bg: isIndex
                        ? colorMode === "dark"
                          ? "#2C3327"
                          : ""
                        : colorMode === "dark"
                        ? "#242323"
                        : "",
                    }}
                  >
                    {link.icon}
                  </Flex>
                </Link>
              );
            })}
          </Flex>
        )}

        {/* <Flex
          py="3rem"
          px={{ base: "2rem", md: "4rem" }}
          onClick={() => router.push("/")}
          _hover={{ cursor: "pointer" }}
        >
          <Image src="/icons/spectra.svg" alt="spectra-protocol-logo" />
          <Heading ml="1rem" variant="heading">
            PECTRA
          </Heading>
        </Flex> */}
      </Flex>
    </RainbowKitProvider>
  );
}
