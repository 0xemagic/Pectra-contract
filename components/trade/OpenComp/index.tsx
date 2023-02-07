import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Flex, NumberDecrementStepper, NumberIncrementStepper, NumberInput,
  NumberInputField,
  NumberInputStepper, Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  VStack
} from "@chakra-ui/react";

import { useWriteOpenPosition } from "@/components/hooks/useContract";
import {
  btcPriceQuery, client2, ethPriceQuery, linkPriceQuery, maticPriceQuery, truncate, uniPriceQuery
} from "@/components/utils";
import { commify } from "ethers/lib/utils";

const OpenComp = () => {
  const labelStyles = {
    mt: "3",
    ml: "-1.5",
    fontSize: "sm",
    fontStyle: "body",
  };

  const [leverage, setLeverage] = useState(1);
  const [amount, setAmount] = useState<string>("0");
  const [longToken, setLongToken] = useState("ETH");
  const [shortToken, setShortToken] = useState("BTC");
  const [ethPrice, setEthPrice] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [linkPrice, setLinkPrice] = useState(0);
  const [uniPrice, setUniPrice] = useState(0);
  const [maticPrice, setMaticPrice] = useState(0);

  const args = [
    ["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"],
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    20,
    20,
    true,
    10,
    10,
    "0x3030303030303030303030303030303030303030303030303030303030303030",
    "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
  ];

  const { data, isLoading, isSuccess, write } = useWriteOpenPosition(args);

  const sameToken = longToken === shortToken;

  const tokens = [
    { name: "ETH", price: ethPrice },
    { name: "BTC", price: btcPrice },
    { name: "MATIC", price: maticPrice },
    { name: "LINK", price: linkPrice },
    { name: "UNI", price: uniPrice },
  ];

  useEffect(() => {
    console.log("data", data);
  }, [data])
  
  async function fetchETHPrice() {
    const data = await client2.query(ethPriceQuery, {}).toPromise();
    setEthPrice(data.data.bundle.ethPriceUSD);
  }

  async function fetchBTCPrice() {
    const data = await client2.query(btcPriceQuery, {}).toPromise();
    setBtcPrice(data.data.pool.token1Price * data.data.bundle.ethPriceUSD);
  }

  async function fetchLinkPrice() {
    const data = await client2.query(linkPriceQuery, {}).toPromise();
    setLinkPrice(data.data.pool.token1Price * data.data.bundle.ethPriceUSD);
  }

  async function fetchUniPrice() {
    const data = await client2.query(uniPriceQuery, {}).toPromise();
    setUniPrice(data.data.pool.token1Price * data.data.bundle.ethPriceUSD);
  }

  async function fetchMaticrice() {
    const data = await client2.query(maticPriceQuery, {}).toPromise();
    setMaticPrice(data.data.pool.token1Price * data.data.bundle.ethPriceUSD);
  }

  const shortPrice = tokens.find(({ name }) => name === shortToken);
  const longPrice = tokens.find(({ name }) => name === longToken);

  useEffect(() => {
    const getTokensPrice = async () => {
      fetchETHPrice();
      fetchBTCPrice();
      fetchLinkPrice();
      fetchUniPrice();
      fetchMaticrice();
    };
    getTokensPrice();
  });

  return (
    <>
      <Text
        fontFamily="body"
        color="#ffffff"
        fontSize="1.06rem"
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
          py="0.5rem"
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
            <Flex flexDir="column">
              <Select
                fontWeight={600}
                fontSize="1.01rem"
                w="fit-content"
                m="auto"
                mr="-1rem"
                variant="unstyled"
                iconColor="#ACE075"
                onChange={(e) => setLongToken(e.target.value)}
                value={longToken}
                isInvalid={sameToken}
                mb="0.25rem"
              >
                {tokens.map((token, index) => {
                  return <option key={index}>{token.name}</option>;
                })}
              </Select>
              <Flex ml="auto" mr={0} fontSize="0.875rem">
                <Text mr={2} fontWeight={300}>
                  current price:
                </Text>
                <Text fontWeight={600}>
                  ${truncate(commify(longPrice!.price.toString()), 2)}
                </Text>
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
          py="0.5rem"
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
            <Flex flexDir="column">
              <Select
                fontWeight={600}
                fontSize="1.01rem"
                w="fit-content"
                m="auto"
                mr="-1rem"
                variant="unstyled"
                iconColor="#FF7272"
                onChange={(e) => setShortToken(e.target.value)}
                value={shortToken}
                isInvalid={sameToken}
                mb="0.25rem"
              >
                {tokens.map((token, index) => {
                  return <option key={index}>{token.name}</option>;
                })}
              </Select>
              <Flex ml="auto" mr={0} fontSize="0.875rem">
                <Text mr={2} fontWeight={300}>
                  current price:
                </Text>
                <Text fontWeight={600}>
                  ${truncate(commify(shortPrice!.price.toString()), 2)}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Flex
            fontFamily="body"
            justify="space-between"
            alignItems="center"
            w="full"
          >
            {/* <Text fontWeight={600} fontFamily="heading" fontSize="0.9rem">
              Amount
            </Text> */}
            <Flex gap="0.75rem" flexDir="column" justifyContent="flex-end">
              <NumberInput
                as={Flex}
                placeholder={"0.0"}
                min={0}
                step={100}
                flex={1}
                value={truncate(amount, 2)}
                onChange={setAmount}
                allowMouseWheel
                inputMode="numeric"
                bg="#171717"
                w="full"
                borderColor="rgba(255, 255, 255, 0.2)"
                borderWidth="2px"
                borderRadius="7px"
                py="0.875rem"
                px="1.25rem"
                direction="row"
                alignItems="center"
              >
                <NumberInputField
                  onChange={(e) => setAmount(e.target.value.toString())}
                  textAlign="end"
                  border="none"
                  fontSize="1.5rem"
                  _focus={{ boxShadow: "none" }}
                  color="#FFFFFF"
                  opacity="0.7"
                />
                <Text fontSize="1.5rem" mr="1.5rem">
                  USDC
                </Text>
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {/*         
              <Text fontWeight={600} fontSize="1.01rem">
                1200 USDC
              </Text> */}
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
            textAlign="center"
            bg="brand"
            color="black"
            mt="-10"
            ml="-5"
            w="1.5rem"
          >
            <Text variant="paragraph" color="black">
              {leverage}x
            </Text>
          </SliderMark>
          <SliderTrack borderRadius="1rem" h="20px">
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6} />
        </Slider>

        <VStack pt={4} w="full" gap={3}>
          <Flex
            w="full"
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Leverage</Text>
            <Text>{leverage}x</Text>
          </Flex>
          <Flex
            w="full"
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Entity Prise</Text>
            <Text>$2000</Text>
          </Flex>
          <Flex
            w="full"
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Liquidation Price</Text>
            <Text>$2000</Text>
          </Flex>
          <Flex
            w="full"
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
        <Button disabled={!write} onClick={() => write?.()} variant="tertiary">
          Open Position
        </Button>
      </VStack>
    </>
  );
};

export default OpenComp;
