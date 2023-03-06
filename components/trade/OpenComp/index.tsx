import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  Input,
} from "@chakra-ui/react";

import { useWriteOpenPosition } from "@/components/hooks/useContract";
import {
  btcPriceQuery,
  client2,
  ethPriceQuery,
  linkPriceQuery,
  maticPriceQuery,
  truncate,
  uniPriceQuery,
} from "@/components/utils";
import { commify } from "ethers/lib/utils";
import OpenPositionModal from "@/components/modals/openPositionModal";
import ErrorModal from "@/components/modals/errorModal";

import { useBalance, useAccount } from "wagmi";

const CloseComp = () => {
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

  const [error, setError] = useState(false);
  const [noAmount, setNoAmount] = useState(false);
  const sameToken = longToken === shortToken;

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

  // smart contract / wagmi STUFF
  const { data, isLoading, isSuccess, write } = useWriteOpenPosition(args);
  const { address, isConnecting, isDisconnected } = useAccount();
  const {
    data: tokenBalance,
    isError,
    isLoading: balanceLoading,
  } = useBalance({
    address: address,
    token: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();

  //current tokens available with price variables for each
  const tokens = [
    { name: "ETH", price: ethPrice },
    { name: "BTC", price: btcPrice },
    // { name: "MATIC", price: maticPrice },
    // { name: "LINK", price: linkPrice },
    // { name: "UNI", price: uniPrice },
  ];

  // functions that fetchETHPrice and fetchBTCPrice are used to get the price of each token asynchronously
  // should change to fetch price every few seconds instead? put into timer maybe?
  async function fetchETHPrice() {
    const data = await client2.query(ethPriceQuery, {}).toPromise();
    setEthPrice(data.data.bundle.ethPriceUSD);
  }

  async function fetchBTCPrice() {
    const data = await client2.query(btcPriceQuery, {}).toPromise();
    setBtcPrice(data.data.pool.token1Price * data.data.bundle.ethPriceUSD);
  }

  // async function fetchLinkPrice() {
  //   const data = await client2.query(linkPriceQuery, {}).toPromise();
  //   setLinkPrice(data.data.pool.token1Price * data.data.bundle.ethPriceUSD);
  // }

  // async function fetchUniPrice() {
  //   const data = await client2.query(uniPriceQuery, {}).toPromise();
  //   setUniPrice(data.data.pool.token1Price * data.data.bundle.ethPriceUSD);
  // }

  // async function fetchMaticrice() {
  //   const data = await client2.query(maticPriceQuery, {}).toPromise();
  //   setMaticPrice(data.data.pool.token1Price * data.data.bundle.ethPriceUSD);
  // }

  const shortPrice = tokens.find(({ name }) => name === shortToken);
  const longPrice = tokens.find(({ name }) => name === longToken);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchETHPrice();
      fetchBTCPrice();
      // fetchLinkPrice();
      // fetchUniPrice();
      // fetchMaticrice();
    }, 2000);

    return () => {
      console.log("Component unmounted");
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (sameToken) {
      setError(true);
      onErrorOpen();
    } else {
      setError(false);
    }
  }, [longToken, shortToken]);

  useEffect(() => {
    if (noAmount && amount === "0") {
      setError(true);
      onErrorOpen();
    }

    if (amount !== "0") {
      setNoAmount(false);
    }
  }, [error, noAmount, amount]);

  return (
    <>
      <Text
        fontFamily="body"
        color="#ffffff"
        fontSize="1.06rem"
        mt="2.5rem"
        mb="1.25rem"
        fontWeight="600"
      >
        Redeem peETH/BTC
      </Text>
      <VStack w="full" gap="0.825rem">
        <Box w="full" mb="1.5rem">
          <Flex
            fontFamily="body"
            direction="column"
            alignItems="center"
            w="full"
          >
            <Flex
              borderRadius="1rem"
              p="1.625rem"
              alignItems={"center"}
              justify="space-between"
              mb="0.25rem"
              w="full"
              bg="#171717"
              height={"3.5rem"}
            >
              <Box fontWeight={500}>Amount</Box>
              <Flex alignItems="center" gap={2} fontWeight={500}>
                <Input w={"2rem"} textAlign='center' p={0.5} value={1} onChange={() => {}} /> peETH/BTC
              </Flex>
            </Flex>
            <Text
              w="full"
              variant="paragraph"
              fontSize="0.85rem"
              color="#FFFFFF"
              opacity="0.7"
            >
              Wallet Balance:{" "}
              <b>
                {tokenBalance
                  ? truncate(tokenBalance!.formatted!.toString(), 2)
                  : 0}
              </b>{" "}
              USDC
            </Text>
          </Flex>
        </Box>

        <Slider
          min={0}
          max={100}
          aria-label="slider-ex-2"
          colorScheme="#3F3F3F"
          defaultValue={1}
          onChange={(val) => setLeverage(val)}
        >
          <SliderMark value={0} {...labelStyles}>
            <Text variant="paragraph">0</Text>
          </SliderMark>
          <SliderMark value={100} {...labelStyles}>
            <Text variant="paragraph">Max</Text>
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
          <Button
            my="1.5rem"
            bg="linear-gradient(180deg, #ACE075 0%, #3EB751 100%)"
            onClick={amount !== "0" ? () => onOpen() : () => setNoAmount(true)}
            variant="tertiary"
          >
            Redeem
          </Button>
          <Flex
            w="full"
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Total USDC</Text>
            <Text>2220</Text>
          </Flex>
          <Flex
            w="full"
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Net</Text>
            <Text>(+45%) 1212</Text>
          </Flex>
        </VStack>
        <Button
          // disabled={!write}
          mt="5.18rem"
          onClick={amount !== "0" ? () => onOpen() : () => setNoAmount(true)}
          variant="tertiary"
        >
          Close Position
        </Button>
      </VStack>

      <OpenPositionModal
        write={write!}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        longPrice={longPrice!}
        shortPrice={shortPrice!}
        amount={amount}
        leverage={leverage}
      />

      {error && (
        <ErrorModal
          error={sameToken ? "Tokens are the same" : "Invalid amount"}
          message={
            sameToken
              ? "Cannot choose the same token for LONG and SHORT"
              : "You cannot open a position without funds."
          }
          isOpen={isErrorOpen}
          onClose={onErrorClose}
        />
      )}
    </>
  );
};

export default CloseComp;
