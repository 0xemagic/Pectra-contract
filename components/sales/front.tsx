import {
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import TotalInvestedBar from "./progressBar";

import BuyTokenModal from "../modals/buyTokenModal";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatDistance } from "date-fns";
import { BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useAccount } from "wagmi";
import { useBuyTokens, usePublicSale } from "../hooks/usePublicSale";

export default function Front() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const { address } = useAccount();

  const { publicPectraBalance } = useBuyTokens(address!);
  const { saleEndEpoch, saleEndDate } = usePublicSale();

  const vested =
    publicPectraBalance && +formatUnits(publicPectraBalance as BigNumberish, 18) > 0
      ? true
      : false;

  return (
    <>
      <Flex
        direction="column"
        minH="80vh"
        px={{ base: "1rem", md: "4rem" }}
        align="center"
      >
        <Flex
          direction="column"
          w="full"
          align="center"
          mb={{ base: "0rem", "3xl": "2rem" }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 1, delay: 0.5 },
              },
            }}
          >
            <Image
              src="./assets/spectra-logo-dark.svg"
              w={{ base: "225px", md: "300px", "3xl": "400px" }}
              h={{ base: "150px", md: "250px", "3xl": "350px" }}
              m="auto"
              alignSelf="center"
              justifySelf="center"
            />
            <Heading
              color={colorMode === "dark" ? "#ACE075" : "#43931E"}
              fontSize={{ base: "2rem", md: "3.5rem" }}
              variant="colored"
              mt="1rem"
              textAlign={{ base: "center", lg: "start" }}
            >
              Pectra Protocol
            </Heading>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            style={{ marginTop: "-1rem" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 1, delay: 1 },
              },
            }}
          >
            <Text
              variant="paragraph"
              textAlign="center"
              mt={{ base: "2.5rem", md: "2rem" }}
              w={{ base: "fit-content", md: "fit-content", lg: "550px" }}
              fontWeight="500"
            >
              The first narrative-driven pair trading platform{" "}
            </Text>
          </motion.div>
        </Flex>
        <motion.div
          initial="hidden"
          animate="visible"
          style={{ width: "100%", marginTop: "1.25rem" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 1, delay: 1.5 },
            },
          }}
        >
          <TotalInvestedBar />
        </motion.div>
        <Flex alignItems="center" justifyItems="center">
          <motion.div
            initial="hidden"
            animate="visible"
            style={{ width: "100%", marginTop: "0rem" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 1, delay: 1.5 },
              },
            }}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              alignItems="center"
              wrap="nowrap"
              mt={{ base: "0rem", "3xl": "2rem" }}
            >
              <Heading
                mt="1rem"
                variant="heading"
                fontSize={{ base: "1.5rem", md: "2rem" }}
              >
                PUBLIC SALE ENDS IN:
              </Heading>
              <Heading
                mt="1rem"
                variant="heading"
                ml="1rem"
                fontSize={{ base: "1.5rem", md: "2rem" }}
                color="#81FF7E"
              >
                {formatDistance(saleEndDate ?? new Date(), new Date(), {
                  addSuffix: true,
                })}
                {/* 00D / 00H / 00M */}
              </Heading>
            </Flex>
            <Flex
              direction={{ base: "column", md: "row" }}
              alignItems="center"
              w="full"
              justifyContent="center"
              mt={{ base: "2.5rem", "3xl": "4rem" }}
            >
              {address ? (
                <Button
                  variant="primary"
                  boxShadow={
                    colorMode === "dark" ? "0px -1px 22px #518128" : "none"
                  }
                  mr={{ base: "none", md: "0.5rem" }}
                  mb={{ base: "1rem", md: "0rem" }}
                  onClick={() => {
                    if (address) {
                      onOpen();
                    }
                  }}
                  disabled={!address}
                >
                  {"BUY $PECTRA"}
                </Button>
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
              <Link
                href="https://medium.com/@spectra_protocol/introducing-the-spectra-public-sale-45e4524df32e"
                isExternal
                _hover={{ textDecoration: "none" }}
              >
                <Button
                  variant="outline"
                  w="155px"
                  h="48px"
                  borderRadius="12px"
                >
                  LEARN MORE
                </Button>
              </Link>
            </Flex>
            <Flex
              pb="2rem"
              mt="2rem"
              alignItems={"center"}
              justifyContent="center"
            >
              {vested && (
                <Link href="/token" _hover={{ textDecoration: "none" }}>
                  <Button variant="secondary">MY $PECTRA</Button>
                </Link>
              )}
            </Flex>
          </motion.div>
        </Flex>
      </Flex>
      {isOpen && <BuyTokenModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
