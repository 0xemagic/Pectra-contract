import ShortLongComp from "@/components/trade/ShortLongComp";
import { Box, Flex, Select } from "@chakra-ui/react";

import { useEffect, useState } from "react";

import OpenPositions from "@/components/trade/OpenPositions";
import Charts from "@/components/trade/Charts";

import { NextSeo } from "next-seo";

type SymbolProps = {
  label: string;
  symbol: string;
}

const Trade = () => {

  const symbols = [
    {
      label: "BTC/ETH",
      symbol: "BINANCE:ETHBTC",
    },
    {
      label: "BTC/UNI",
      symbol: "BINANCE:UNIBTC",
    },
    {
      label: "BTC/LINK",
      symbol: "BINANCE:LINKBTC",
    },
    {
      label: "BTC/MATIC",
      symbol: "BINANCE:MATICBTC",
    },
  ]

  const [symbol, setSymbol] = useState<SymbolProps>(symbols[1]);

  const handleChange = (selectedValue: string) => {
    const selectedObject = symbols.find(symb => symb.label === selectedValue);
    setSymbol(selectedObject!);
  }

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
        <Flex w="27.625rem" direction={{ base: "row", md: "column" }} mr="1rem">
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
            mb="1rem"
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
            border="2px solid #404040"
            px="1.68rem"
            py="1.15rem"
            fontSize="1.25rem"
            mb="1rem"
          >
            <Select
                variant="outline"
                onChange={(e) => handleChange(e.target.value)}
                value={symbol!.label}
              >
                {symbols.map((symb, index) => {
                  return <option key={index}>{symb.label}</option>;
                })}
              </Select>
          </Box>

          <Box
            w="full"
            minH="50vh"
            px="1.68rem"
            py="1.15rem"
            fontSize="1.25rem"
            borderRadius={"0.5rem"}
            background="#202020"
            mb="1rem"
          >
            <Charts symb={symbol.symbol} />
          </Box>
          <OpenPositions />
        </Flex>
      </Flex>
    </>
  );
};

export default Trade;
