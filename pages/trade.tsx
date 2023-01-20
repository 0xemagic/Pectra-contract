import ShortLongComp from "@/components/trade/ShortLongComp";
import {
  Box,
  Flex,
  Select,
} from "@chakra-ui/react";

import OpenPositions from "@/components/trade/OpenPositions";

import { NextSeo } from "next-seo";

const Trade = () => {
  return (
    <>
      <NextSeo
        title="Pectra Protocol Trade"
        description="Pair trading made easy."
        openGraph={{
          title: "Pectra Protocol Trade",
          description: "Pair trading made easy.",
          images: [
            {
              url: "https://www.spectraprotocol.com/spectra-protocol.png",
              width: 800,
              height: 600,
              alt: "Pectra Protocol",
            },
          ],
        }}
      />
      <Flex w="full" fontFamily={"heading"} direction="row" px="4.25rem">
        <Flex w="27.625rem" direction={{base: "row", md: "column"}}>
          <Box
            h="fit-content"
            w="full"
            borderRadius={"0.5rem"}
            background="#202020"
            border="2px solid #404040"
            fontWeight="bold"
            px="1.68rem"
            py="1.5rem"
            fontSize="1.25rem"
          >
            TRADE
          </Box>
          <Box
            w="full"
            borderRadius={"0.5rem"}
            background="#202020"
            fontStyle="body"
            px="1.68rem"
            py="1.25rem"
          >
            <ShortLongComp />
          </Box>
        </Flex>

        <Flex flex={1} direction="column">
          <Box
            h="fit-content"
            w="full"
            borderRadius={"0.5rem"}
            background="#202020"
            px="1.68rem"
            py="1.15rem"
            fontSize="1.25rem"
          >
            <Select variant="outline" placeholder={`BTC/ETH`} />
          </Box>

          <Box
            w="full"
            px="1.68rem"
            py="1.15rem"
            fontSize="1.25rem"
            borderRadius={"0.5rem"}
            background="#202020"
          >
            {" "}
            Charts
          </Box>
          <OpenPositions/>
        </Flex>
      </Flex>
    </>
  );
};

export default Trade;