import { useState, useEffect } from "react";

import { Box, Button, Flex, Select, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Text, VStack } from "@chakra-ui/react";

import { ethPriceQuery, btcPriceQuery, truncate } from "@/components/utils";
import { client2 } from "@/components/utils";

const OpenComp = () => {
  const labelStyles = {
    mt: "3",
    ml: "-1.5",
    fontSize: "sm",
    fontStyle: "body",
  };

  const [leverage, setLeverage] = useState(1);
  const [amount, setAmount] = useState(0);
  const [longToken, setLongToken] = useState("ETH");
  const [shortToken, setShortToken] = useState("BTC");
  const [ethPrice, setEthPrice] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);

  const sameToken = longToken === shortToken;

  const tokens = [
    "ETH",
    "BTC",
    "MATIC",
    "LINK",
    "UNI",
  ]

  async function fetchETHPrice() {
    const data = await client2.query(ethPriceQuery, {}).toPromise();
    setEthPrice(data.data.bundle.ethPriceUSD);
  }

  async function fetchBTCPrice() {
    const data = await client2.query(btcPriceQuery, {}).toPromise();
    setBtcPrice(data.data.pool.token1Price * data.data.bundle.ethPriceUSD);
  }

  useEffect(() => {
    const getTokensPrice = async () => {
      fetchETHPrice();
      fetchBTCPrice();
    };
    getTokensPrice();
  });

  return <>
      <Text
        fontFamily="body"
        color="#ffffff"
        fontSize="1.06rem"
        mt="1.8125rem"
        mb="1.25rem"
        fontWeight="600"
      >
        Pick a pair
      </Text>
      <VStack gap="0.825rem">
        <Box
          bg="rgba(172, 224, 117, 0.2)"
          w="full"
          borderColor="#ACE075"
          borderWidth="2px"
          borderRadius="7px"
          py="0.875rem"
          px="1.25rem"
        >
          <Flex
            fontFamily="body"
            justify="space-between"
            alignItems="center"
            w="full"
          >
            <Text fontWeight={600} fontFamily="heading" fontSize="0.9rem">
              LONG
            </Text>
            <Flex gap="0.75rem" flexDir="column" justifyContent="flex-end">
              <Select
                fontWeight={600}
                fontSize="1.01rem"
                w="fit-content"
                variant="unstyled"
                onChange={(e) => setLongToken(e.target.value)}
                value={longToken}
                isInvalid={sameToken}
              >
                {tokens.map((token) => {
                  return <option value={token}>{token}</option>})}
              </Select>
              <Flex ml="auto" mr={0} fontSize="0.875rem">
                <Text mr={2} fontWeight={300}>
                  current price:
                </Text>
                <Text fontWeight={600}>$              {longToken === "ETH"
                ? truncate(ethPrice.toString(), 2)
                : truncate(btcPrice.toString(), 2)}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
        <Box
          bg="rgba(255, 114, 114, 0.2)"
          w="full"
          borderColor="#FF7272"
          borderWidth="2px"
          borderRadius="7px"
          py="0.875rem"
          px="1.25rem"
        >
          <Flex
            fontFamily="body"
            justify="space-between"
            alignItems="center"
            w="full"
          >
            <Text fontWeight={600} fontFamily="heading" fontSize="0.9rem">
              Short
            </Text>
            <Flex gap="0.75rem" flexDir="column" justifyContent="flex-end">
              <Select
                fontWeight={600}
                fontSize="1.01rem"
                w="fit-content"
                ml="auto"
                mr={0}
                variant="unstyled"
                onChange={(e) => setShortToken(e.target.value)}
                value={shortToken}
                isInvalid={sameToken}
              >
                    {tokens.map((token) => {
                  return <option value={token}>{token}</option>})}
              </Select>
              <Flex ml="auto" mr={0} fontSize="0.875rem">
                <Text mr={2} fontWeight={300}>
                  current price:
                </Text>
                <Text fontWeight={600}>$     {shortToken === "ETH"
                ? truncate(ethPrice.toString(), 2)
                : truncate(btcPrice.toString(), 2)}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
        <Box
          bg="#171717"
          w="full"
          borderColor="rgba(255, 255, 255, 0.2)"
          borderWidth="2px"
          borderRadius="7px"
          py="0.875rem"
          px="1.25rem"
        >
          <Flex
            fontFamily="body"
            justify="space-between"
            alignItems="center"
            w="full"
          >
            <Text fontWeight={600} fontFamily="heading" fontSize="0.9rem">
              Amount
            </Text>
            <Flex gap="0.75rem" flexDir="column" justifyContent="flex-end">
              <Text fontWeight={600} fontSize="1.01rem">
                1200 USDC
              </Text>
            </Flex>
          </Flex>
        </Box>
        <Flex
          w="full"
          fontWeight={600}
          fontSize="1.01rem"
          fontFamily="body"
          gap={3}
        >
          <Text>Leverage</Text>
          <Text
            px={3}
            py={1}
            fontWeight={500}
            fontSize="0.9rem"
            bg="#2F2F2F"
            borderRadius="7px"
          >
            {leverage}x
          </Text>
        </Flex>
        <Slider
          min={0}
          max={2}
          step={1}
          aria-label="slider-ex-2"
          colorScheme="#3F3F3F"
          defaultValue={1}
          onChange={(val) => setLeverage(val)}
        >
          <SliderMark value={0} {...labelStyles}>
          <Text variant="paragraph">0x</Text>
          </SliderMark>
          <SliderMark value={1} {...labelStyles}>
          <Text variant="paragraph">1x</Text>
          </SliderMark>
          <SliderMark value={2} {...labelStyles}>
          <Text variant="paragraph">2x</Text>
          </SliderMark>
          <SliderMark
          value={leverage}
          textAlign='center'
          bg='brand'
          color='black'
          mt='-10'
          ml='-5'
          w='1.5rem'
        >
            <Text variant="paragraph" color="black">{leverage}x</Text>
        </SliderMark>
          <SliderTrack borderRadius="1rem" h="20px">
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6} />
        </Slider>

        <VStack pt={4} w="full" gap={3}>
          <Flex w='full'
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Leverage</Text>
            <Text>{leverage}x</Text>
          </Flex>
          <Flex w='full'
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Entity Prise</Text>
            <Text>$2000</Text>
          </Flex>
          <Flex w='full'
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Liquidation Price</Text>
            <Text>$2000</Text>
          </Flex>
          <Flex w='full'
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Fees</Text>
            <Text>0.02 ETH</Text>
          </Flex>
        </VStack>
        <Button variant="tertiary">
          Open Position
        </Button>
        </VStack>
        </>
}

export default OpenComp