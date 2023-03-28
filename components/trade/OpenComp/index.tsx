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
} from "@chakra-ui/react";

import { useWriteOpenPosition } from "@/components/hooks/useContract";

import { commify } from "ethers/lib/utils";
import OpenPositionModal from "@/components/modals/openPositionModal";
import ErrorModal from "@/components/modals/errorModal";

import { useBalance, useAccount } from "wagmi";

import {
  truncate,
} from "@/components/utils";

const OpenComp = ({ handleSymbolChange, symbols, tokens, symbol }: any) => {
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

  //smart contract interaction
  const { data, isLoading, isSuccess, write } = useWriteOpenPosition(args);

  // wagmi user data fetching
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

  // function that changes the symbols for the charts
  function getSymbol(shortToken: any, longToken: any) {
    const shortTokenInfo = tokens.find((token: any) => token.name === shortToken);
    const longTokenInfo = tokens.find((token: any) => token.name === longToken);
    if (shortTokenInfo && longTokenInfo) {
      const selectedLabel = `${longTokenInfo.name}/${shortTokenInfo.name}`;
      const symb = symbols.find(
        (sym: any) =>
          sym.label === selectedLabel
      );
      if (symb) {
        handleSymbolChange(symb.label);
      }
    }
    return null;
  }

  useEffect(() => {
    getSymbol(shortToken, longToken);
  }, [shortToken, longToken]);

  const getTokensFromSymbol = (symb: any) => {
    const tokens = symb !== undefined ? symb.label.split('/').filter((t: any) => t !== '') : ["ETH", "BTC"];
    return { longToken1: tokens[0], shortToken1: tokens[1] };
  };

  useEffect(() => {
    const { longToken1, shortToken1 } = getTokensFromSymbol(symbol);
    if (shortToken1 !== shortToken) {
      setShortToken(shortToken1);
    }

    if (longToken !== longToken1) {
      setLongToken(longToken1);
    }
  }, [symbol]);


  const shortPrice = tokens.find(({ name }: any) => name === shortToken);
  const longPrice = tokens.find(({ name }: any) => name === longToken);

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
                {tokens.map((token: any, index: number) => {
                  return <option key={index} selected={token.name === longToken}>{token.name}</option>;
                })}
              </Select>

              <Flex ml="auto" justify="end" mr={0} fontSize="0.875rem">
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
            <Text
              fontWeight={600}
              fontFamily="heading"
              fontSize="0.9rem"
              justifySelf="center"
            >
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
                {tokens.map((token: any, index: number) => {
                  return <option key={index} selected={token.name === shortToken}>{token.name}</option>;
                })}
              </Select>
              <Flex ml="auto" justify="end" mr={0} fontSize="0.875rem">
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
            direction="column"
            alignItems="center"
            w="full"
          >
            <Flex
              gap="0.75rem"
              flexDir="column"
              justifyContent="flex-end"
              mb="0.25rem"
            >
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
                borderColor={
                  noAmount || error ? "red" : "rgba(255, 255, 255, 0.2)"
                }
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
            </Flex>
            <Text
              variant="paragraph"
              fontSize="0.85rem"
              alignSelf="end"
              mr="1.25rem"
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
          min={1}
          max={3}
          step={1}
          aria-label="slider-ex-2"
          colorScheme="#3F3F3F"
          defaultValue={1}
          onChange={(val) => setLeverage(val)}
        >
          <SliderMark value={1} {...labelStyles}>
            <Text variant="paragraph">1x</Text>
          </SliderMark>
          <SliderMark value={2} {...labelStyles}>
            <Text variant="paragraph">2x</Text>
          </SliderMark>
          <SliderMark value={3} {...labelStyles}>
            <Text variant="paragraph">3x</Text>
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
        <Button
          disabled={amount === "0" || error}
          onClick={amount !== "0" ? () => onOpen() : () => setNoAmount(true)}
          variant="tertiary"

        >
          {amount === "0" ? "Enter an amount" : "Open Position"}
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

export default OpenComp;
