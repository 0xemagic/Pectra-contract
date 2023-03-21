import ModeComp from "@/components/trade/ModeComp";
import { Box, Flex, Select, Grid, GridItem } from "@chakra-ui/react";

import { useEffect, useState } from "react";

import OpenPositions from "@/components/trade/PositionsTable";
import Charts from "@/components/trade/Charts";
import Tickers from "@/components/trade/tickers";

import { NextSeo } from "next-seo";
import { useReadPrice } from "@/components/hooks/usePrices";

import {
  btcPriceQuery,
  client2,
  ethPriceQuery,
  linkPriceQuery,
  maticPriceQuery,
  truncate,
  uniPriceQuery,
} from "@/components/utils";

type SymbolProps = {
  label: string;
  symbol: string;
};

const Trade = () => {
  const { btcEthRawPrice, btcEthDecimals } = useReadPrice();
  const { linkEthRawPrice, linkEthDecimals } = useReadPrice();

  const [ethPrice, setEthPrice] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [linkPrice, setLinkPrice] = useState(0);
  const [uniPrice, setUniPrice] = useState(0);

  const symbols = [
    {
      label: "BTC/ETH",
      symbol: "VANTAGE:BTCETH",
      price: btcEthRawPrice
        ? Number(
            (btcEthRawPrice as any).answer!.toString() /
              Math.pow(10, btcEthDecimals as any)
          ).toFixed(4)
        : 0,
    },
    {
      label: "UNI/BTC",
      symbol: "BINANCE:UNIBTC",
      price: (btcPrice && uniPrice) ? (uniPrice/btcPrice).toFixed(4) : 0,
    },
    {
      label: "LINK/BTC",
      symbol: "BINANCE:LINKBTC",
      price: (linkPrice && btcPrice) ? (linkPrice/btcPrice).toFixed(4) : 0,
    },
    {
      label: "LINK/ETH",
      symbol: "GEMINI:LINKETH",
      price: linkEthRawPrice
        ? Number(
            (linkEthRawPrice as any).answer!.toString() /
              Math.pow(10, linkEthDecimals as any)
          ).toFixed(4)
        : 0,
    },{
    label: "ETH/LINK",
    symbol: "UNISWAP:WETHLINK",
    price: (ethPrice && linkPrice) ? (ethPrice/linkPrice).toFixed(4) : 0,
    }
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

    // function that fetches prices is used to get the price of each token asynchronously
  // should change to fetch price every few seconds instead? put into timer maybe?
  async function fetchPrices() {
    const data1 = await client2.query(ethPriceQuery, {}).toPromise();
    setEthPrice(data1.data.bundle.ethPriceUSD);

    const data2 = await client2.query(btcPriceQuery, {}).toPromise();
    setBtcPrice(data2.data.pool.token1Price * data2.data.bundle.ethPriceUSD);

    const data3 = await client2.query(linkPriceQuery, {}).toPromise();
    setLinkPrice(data3.data.pool.token1Price * data3.data.bundle.ethPriceUSD);

    const data4 = await client2.query(uniPriceQuery, {}).toPromise();
    setUniPrice(data4.data.pool.token1Price * data4.data.bundle.ethPriceUSD);
  }

    //current tokens available with price variables for each
    const tokens = [
      { name: "ETH", price: ethPrice, address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" },
      { name: "BTC", price: btcPrice, address: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f" },
      { name: "LINK", price: linkPrice, address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4" },
      { name: "UNI", price: uniPrice, address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0" },
    ];

  useEffect(() => {
      fetchPrices();
  }, []);

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
          <ModeComp handleTabsChange={handleTabsChange} tabIndex={tabIndex} handleSymbolChange={handleSymbolChange} symbols={symbols} tokens={tokens} symbol={symbol} />
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
