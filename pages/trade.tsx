import ModeComp from "@/components/trade/ModeComp";
import { Box, Flex, Select, Grid, GridItem } from "@chakra-ui/react";

import { useEffect, useState } from "react";

import OpenPositions from "@/components/trade/PositionsTable";
import Charts from "@/components/trade/Charts";
import Tickers from "@/components/trade/tickers";

import { NextSeo } from "next-seo";
import { useReadPrice } from "@/components/hooks/usePrices";

type SymbolProps = {
  label: string;
  symbol: string;
};

const Trade = () => {
  const { btcEthRawPrice, btcEthDecimals } = useReadPrice();
  const { linkEthRawPrice, linkEthDecimals } = useReadPrice();

  const symbols = [
    {
      label: "BTC/ETH",
      symbol: "VANTAGE:BTCETH",
      price: btcEthRawPrice
        ? Number(
            (btcEthRawPrice as any).answer!.toString() /
              Math.pow(10, btcEthDecimals as any)
          ).toFixed(2)
        : 0,
    },
    // {
    //   label: "BTC/UNI",
    //   symbol: "BINANCE:UNIBTC",
    // },
    {
      label: "LINK/ETH",
      symbol: "GEMINI:LINKETH",
      price: linkEthRawPrice
        ? Number(
            (linkEthRawPrice as any).answer!.toString() /
              Math.pow(10, linkEthDecimals as any)
          ).toFixed(4)
        : 0,
    },
    // {
    //   label: "BTC/MATIC",
    //   symbol: "BINANCE:MATICBTC",
    // },
  ];

  const [symbol, setSymbol] = useState<SymbolProps>(symbols[1]);

  const handleSymbolChange = (selectedValue: string) => {
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
      <Flex
        w="full"
        fontFamily={"heading"}
        px={{ base: "2rem", "3xl": "4.25rem" }}
      >
        <Flex
          w={tabIndex === 0 ? "500px" : "full"}
          border="1px solid rgba(255, 255, 255, 0.2)"
          borderRadius="12px"
          direction={{ base: "row", md: "column" }}
          mr="1rem"
          background="#202020"
          px="1.68rem"
          py="1.25rem"
        >
          <ModeComp handleTabsChange={handleTabsChange} tabIndex={tabIndex} handleSymbolChange={handleSymbolChange} symbols={symbols} />
        </Flex>

        <Flex w="70%" flex={1} direction="column">
          {/*<Box
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
            {tabIndex === 0 && (
              <Select
                variant="outline"
                onChange={(e) => handleChange(e.target.value)}
                value={symbol?.label}
              >
                  {symbols.map((symb, index) => (
                       <option style={optionStyle}>
                        <Flex justifyContent="space-between" justify="space-between">
                        <span style={valueStyle as any}>{symb.label}</span>
                       <span style={valueStyle as any}>{symb.label}</span>
                       <span style={valueStyle as any}>{symb.label}</span>
                        </Flex>
                     </option>
                    )
                  )} 
              </Select>
            )}
          </Box>*/}

          <Flex
            display={tabIndex === 0 ? "block" : "none"}
            w="100%"
            minH="50vh"
            px="1.5rem"
            py="1.15rem"
            fontSize="1.25rem"
            borderRadius={"0.5rem"}
            background="#202020"
            mb="1rem"
            border="1px solid rgba(255, 255, 255, 0.2)"
          >
            <Flex h="full" w="100%" gap={2}>
              <Box h="100%" w="70%">
                <Charts symb={symbol?.symbol} />
              </Box>
              <Box h="100%" w="30%">
                <Tickers symbols={symbols} handleChange={handleSymbolChange} />
              </Box>
            </Flex>
          </Flex>
          <Box w="100%" display={tabIndex === 0 ? "block" : "none"}>
            <OpenPositions tabIndex={tabIndex} />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Trade;
