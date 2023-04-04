import {
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Button,
  Text,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";

import { useState } from "react";

import { BiDownArrowAlt } from "react-icons/bi";

import { truncate } from "../utils";

type OpenPositionModalProps = {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  long: any;
  short: any;
  leverage: string;
  collateral: string;
  entry: string;
  liquidation: string;
  pnl: string;
  netvalue: string;
  size: string;
  shortPrice: any;
  longPrice: any;
};

type BoxesProps = {
  bg: string;
  border: string;
  usdcValue: number;
  tokenValue?: number;
  title: string;
  token?: string;
};

type ValuesProps = {
  title: string;
  value: string | number;
};

const OpenPositionModal = ({
  isOpen,
  onClose,
  onOpen,
  long,
  short,
  leverage,
  collateral,
  entry,
  liquidation,
  pnl,
  netvalue,
  size,
  shortPrice,
  longPrice,
}: OpenPositionModalProps) => {

  const [amount, setAmount] = useState<number>(0);

  const Boxes = ({ bg, border, tokenValue, usdcValue, title, token }: BoxesProps) => {
    console.log(usdcValue)
    return (
      <Box
        bg={bg}
        border={border}
        py="0.5rem"
        px="1.25rem"
        borderRadius="7px"
        w="full"
        minH="40px"
        mb="1rem"
      >
        <Flex
          fontFamily="body"
          justify="space-between"
          alignItems="center"
          w="full"
        >
          <Text>{title}</Text>
          <Flex>
            <Text variant="paragraph">{tokenValue}</Text>
            <Text variant="paragraph" ml="0.5rem">{token}</Text>
            <Text variant="paragraph" ml="0.5rem">
              {`($${usdcValue})`}
            </Text>
          </Flex>
        </Flex>
      </Box>
    );
  };

  const Values = ({ title, value }: ValuesProps) => {
    return (
      <Flex
        w="full"
        alignItems="center"
        justify="space-between"
        fontFamily="body"
        fontWeight={500}
        fontSize="0.9rem"
        mb="1rem"
      >
        <Text variant="paragraph">{title}</Text>
        <Text>{value}</Text>
      </Flex>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#202020" border="solid 1px rgba(255, 255, 255, 0.2)">
        <ModalHeader>Close Trade</ModalHeader>
        <ModalCloseButton />
        <ModalBody w="full">
          <Flex
            as={Flex}
            direction="column"
            px="1.5rem"
            py="1rem"
            alignItems="center"
          >
            <InputGroup>
              <InputLeftElement
                ml={3}
                height="50px"
                children={
                  <Flex alignItems="center" justifyContent="center">
                    Close
                  </Flex>
                }
              />
              <Input
                pl="80px"
                height="50px"
                type="number"
                placeholder="Amount"
                value={amount}
              />
              <InputRightElement
                mr="1rem"
                ml={3}
                height="50px"
                children={
                  <Button variant="function" alignItems="center" justifyContent="center" minW="50px"
                    onClick={() => setAmount(+netvalue)}
                  >
                    Max
                  </Button>
                }
              />
            </InputGroup>
            <Text mt="0.25rem" alignSelf="end" variant="paragraph">
              Max Amount: {netvalue} USDC
            </Text>
            <Flex my="1rem">
              <BiDownArrowAlt size="2.25rem" />

            </Flex>
            <Boxes
              bg="#404040"
              border="none"
              usdcValue={250}
              tokenValue={0.15}
              token={long}
              title="Long"
            />

            <Boxes
              bg="#404040"
              border="none"
              usdcValue={250}
              tokenValue={0.010}
              token={short}
              title="Short"
            />

            <Flex mt="1rem" mb="1rem" direction="column" w="full">
              <Values title="Total Entry Size" value="400 USDC" />
              <Values title="Current Size" value={`500 USDC`} />
              <Values title="PnL" value={`${pnl}`} />
              <Values title="Fees" value={`0.3 USDC`} />
              {/* <Values title="Position Value" value={`$${+amount * leverage}`} />
                <Values
                  title="Liquidation Price"
                  value={`$${truncate(
                    (longPrice.price / shortPrice.price).toString(),
                    5
                  )}`}
                /> */}{" "}
                 <Boxes
              bg="#404040"
              border="none"
              usdcValue={+netvalue + +pnl}
              tokenValue={+netvalue + +pnl}
              token={"USDC"}
              title="Receive"
            />
            </Flex>

            <Button variant="secondary" onClick={() => console.log(longPrice
            )}>
              Close Position
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OpenPositionModal;
