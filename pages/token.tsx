import {
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";

import { NextSeo } from "next-seo";

import { BigNumberish } from "ethers";
import { commify, formatUnits } from "ethers/lib/utils";
import { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaCaretDown } from "react-icons/fa";
import { useAccount } from "wagmi";
import { truncate } from "../components/utils";

import BuyTokenModal from "../components/modals/buyTokenModal";
import TokenDetailsModal from "../components/modals/tokenInvestDetailsModal";

import { useBuyTokens } from "../components/hooks/usePublicSale";

export default function Dashboard({ onOpen }: any) {
  const {
    isOpen: isOpenDashboard,
    onClose: onCloseDashboard,
    onOpen: onOpenDashboard,
  } = useDisclosure();
  const {
    isOpen: isOpenBuy,
    onClose: onCloseBuy,
    onOpen: onOpenBuy,
  } = useDisclosure();

  const { address } = useAccount();
  const [vestInfo, setVestInfo] = useState(false);
  const { colorMode } = useColorMode();

  const { publicPectraBalance, migratorBalance, spectraPrice } = useBuyTokens(address!);
  
  const totalBalance = publicPectraBalance && migratorBalance &&
    (+migratorBalance?.formatted! +
      +formatUnits(publicPectraBalance! as BigNumberish))

  return (
    <>
      <NextSeo
        title="Pectra Token Dashboard"
        description="$PECTRA token dashboard."
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
      />{" "}
      <Flex
        direction="column"
        alignItems="center"
        justifyItems="center"
        pt="2.5rem"
        pb="5rem"
      >
        <Flex direction="row" py="1.5rem">
          <Heading
            mr="0.25rem"
            variant="heading"
            fontSize={{ base: "1.5rem", md: "2rem" }}
            color="#81FF7E"
          >
            $PECTRA
          </Heading>
          <Heading variant="heading" fontSize={{ base: "1.5rem", md: "2rem" }}>
            Token Dashboard
          </Heading>
        </Flex>
        <Flex
          w={{ base: "90%", md: "50%" }}
          bgColor={colorMode === "dark" ? "#2B3226" : "#F2F2F2"}
          py="1.5rem"
          justifyContent="center"
          alignItems="center"
          borderRadius="xl"
          direction="column"
        >
          <Flex direction="row" alignItems="center">
            <Text variant="paragraph" textAlign="center" mr="0.5rem">
              Total $PECTRA Balance
            </Text>
            <IconButton
              variant="ghost"
              aria-label="Open $PECTRA Dashboard"
              icon={<FaCaretDown />}
              onClick={onOpenDashboard}
            />
          </Flex>

          <Flex
            direction={{ base: "column", md: "row" }}
            alignItems="end"
            justifyItems="center"
          >
            <Heading
              mt="1rem"
              mr={{ base: "0rem", md: "0.5rem" }}
              variant="heading"
              fontSize={{ base: "1.5rem", md: "2rem" }}
            >
              {totalBalance
                    ? commify(truncate(totalBalance.toString(), 2))
                    : 0}
            </Heading>
            <Heading
              mt="1rem"
              variant="heading"
              color="#81FF7E"
              fontSize={{ base: "0.5rem", md: "1.25rem" }}
            >
              $PECTRA
            </Heading>
          </Flex>
          <Tooltip
            label="Your tokens will be available for trading 12 months after the public sale ends."
            isOpen={vestInfo}
          >
            <Flex
              alignItems="center"
              justifyContent="center"
              placeContent="center"
              mt="0.75rem"
              mr="0.5rem"
              // color="#43931E"
              onMouseEnter={() => setVestInfo(true)}
              onMouseLeave={() => setVestInfo(false)}
              onClick={() => setVestInfo(true)}
            >
              <Text
                variant="paragraph"
                mr="0.25rem"
                fontSize={{ base: "0.5rem", md: "0.75rem" }}
                textAlign="center"
              >
                12 months vest
              </Text>
              <AiOutlineInfoCircle
                color={colorMode === "dark" ? "white" : "black"}
              />
            </Flex>
          </Tooltip>
        </Flex>

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
            UNLOCKS IN:
          </Heading>
          <Heading
            mt="1rem"
            variant="heading"
            ml="1rem"
            fontSize={{ base: "1.5rem", md: "2rem" }}
            color="#81FF7E"
          >
            TBD
          </Heading>
        </Flex>

        <Flex
          direction="column"
          alignItems="center"
          w="full"
          justifyContent="center"
          mt={{ base: "2.5rem", "3xl": "4rem" }}
        >
          <Button variant="secondary" mb="1rem" isDisabled>
            CLAIM
          </Button>
          <Button
            variant="primary"
            boxShadow={colorMode === "dark" ? "0px -1px 22px #518128" : "none"}
            // mr={{ base: "none", md: "0.5rem" }}
            onClick={() => onOpenBuy()}
          >
            BUY $PECTRA
          </Button>
        </Flex>
      </Flex>
      {isOpenDashboard && !isOpenBuy ? (
        <TokenDetailsModal
          isOpenDashboard={isOpenDashboard}
          onCloseDashboard={onCloseDashboard}
          onOpenBuy={onOpenBuy}
          publicPectraBalance={publicPectraBalance! as BigNumberish} 
          migratorBalance={migratorBalance} 
          spectraPrice={spectraPrice! as BigNumberish}
          totalBalance={totalBalance}
        />
      ) : null}
      {isOpenBuy && !isOpenDashboard ? (
        <BuyTokenModal isOpen={isOpenBuy} onClose={onCloseBuy} />
      ) : null}
    </>
  );
}
