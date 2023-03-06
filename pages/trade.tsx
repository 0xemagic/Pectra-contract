import ModeComp from "@/components/trade/ModeComp";
import { Box, Flex, Select, Grid, GridItem } from "@chakra-ui/react";

import { useEffect, useState } from "react";

import OpenPositions from "@/components/trade/PositionsTable";
import Charts from "@/components/trade/Charts";
import Tickers from "@/components/trade/tickers";

import { NextSeo } from "next-seo";

type SymbolProps = {
  label: string;
  symbol: string;
};

const Trade = () => {
  const symbols = [
    {
      label: "BTC/ETH",
      symbol: "BINANCE:ETHBTC",
    },
    // {
    //   label: "BTC/UNI",
    //   symbol: "BINANCE:UNIBTC",
    // },
    // {
    //   label: "BTC/LINK",
    //   symbol: "BINANCE:LINKBTC",
    // },
    // {
    //   label: "BTC/MATIC",
    //   symbol: "BINANCE:MATICBTC",
    // },
  ];

  const [symbol, setSymbol] = useState<SymbolProps>(symbols[1]);

  const handleChange = (selectedValue: string) => {
    const selectedObject = symbols.find((symb) => symb.label === selectedValue);
    setSymbol(selectedObject!);
  };

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const optionStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridGap: "10px",
  };

  const valueStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

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
      <Flex w="full" fontFamily={"heading"} px="4.25rem">
        <Flex gap='0.75rem' w="full" alignItems={"flex-start"}>
          <Box w="30%">
            <Flex
              w="full"
              alignItems="center"
              bg="#202020"
              borderColor={"#404040"}
              borderWidth="2px"
              pl="69px"
              h="75px"
              borderRadius="12px"
              fontFamily={"body"}
            >
              TRADE
            </Flex>


              <Flex mt="0.75rem" p="1.25rem" w='full'
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="12px"
                direction={{ base: "row", md: "column" }}
                mr="1rem"
                background="#202020"
                px="1.68rem"
                py="1.25rem"
              >
                <ModeComp
                  handleTabsChange={handleTabsChange}
                  tabIndex={tabIndex}
                />
              </Flex>
            </Box>

          <Box w="70%">
          <Flex
            minH="50vh"
            px="1.68rem"
            py="1.15rem"
            fontSize="1.25rem"
            borderRadius={"0.5rem"}
            background="#202020"
            mb="1rem"
            h='full'
            direction="row"
            justify="center"
            border="1px solid rgba(255, 255, 255, 0.2)"
          >
            <Charts symb={symbol?.symbol} />
          </Flex>
          <Box w="100%" >
            <OpenPositions />
          </Box>


          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Trade;


