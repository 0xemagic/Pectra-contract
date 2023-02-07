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
  VStack,
} from "@chakra-ui/react";

import { BiDownArrowAlt } from "react-icons/bi";

import { truncate } from "../utils";

// type Token = {
//   price: number;
//   amount: string;
// };

type OpenPositionModalProps = {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  write: () => void | undefined;
  longPrice: any;
  shortPrice: any;
  amount: string;
  leverage: number;
};

type BoxesProps = {
  bg: string;
  border: string;
  value: string;
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
  write,
  longPrice,
  shortPrice,
  amount,
  leverage
}: OpenPositionModalProps) => {
  const Boxes = ({ bg, border, value, title, token }: BoxesProps) => {
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
            <Text variant="paragraph" mr="0.5rem">
              {value}
            </Text>
            <Text variant="paragraph">{token}</Text>
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
        <ModalHeader>Confirm Position</ModalHeader>
        <ModalCloseButton />
        <ModalBody w="full">
          <Flex as={Flex} direction="column" px="1.5rem" py="1rem" alignItems="center">
            <Boxes
              bg="transparent"
              border="1px solid #505050"
              value={amount}
              token="USDC"
              title="Pay"
            />
            
            <BiDownArrowAlt size="2rem" />

            <Boxes
              bg="#404040"
              border="none"
              value={truncate(((+amount / longPrice.price) / 2 * leverage).toString(), 5)}
              token={longPrice.name}
              title="Long"
            />
            <Boxes
              bg="#404040"
              border="none"
              value={truncate(((+amount / shortPrice.price ) / 2 * leverage).toString(), 5)}
              token={shortPrice.name}
              title="Short"
            />

            <Flex mt="1rem" mb="1rem" direction="column" w="full">
              <Values title="Collateral Token" value="ETH" />
              <Values title="Collateral Value" value={`$${amount}`} />
              <Values title="Leverage" value={`${leverage}x`} />
              <Values title="Position Value" value={`$${+amount * leverage}`} />
              <Values
                title="Liquidation Price"
                value={`$${truncate(
                  (longPrice.price / shortPrice.price).toString(),
                  5
                )}`}
              />
              <Values title="Fees" value="0.3$" />
            </Flex>

            <Button variant="secondary" onClick={() => write?.()}>
              Open Position
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OpenPositionModal;
