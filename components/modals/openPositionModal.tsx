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
};

type BoxesProps = {
  bg: string;
  border: string;
  value: string;
  title: string;
    token?: string;
};

const OpenPositionModal = ({
  isOpen,
  onClose,
  onOpen,
  write,
  longPrice,
  shortPrice,
  amount,
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
          <Text variant="paragraph" mr="0.5rem">{value}</Text>
            <Text variant="paragraph">{token}</Text>
          </Flex>
        </Flex>
      </Box>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#353535" border="solid 1px rgba(255, 255, 255, 0.2)">
        <ModalHeader>Confirm Position</ModalHeader>
        <ModalCloseButton />
        <ModalBody w="full">
          <Flex as={Flex} direction="column" px="1.5rem" alignItems="center">
            <Boxes
              bg="transparent"
              border="1px solid #505050"
              value={amount}       
              token="USDC"       
              title="Pay"
            />
            <BiDownArrowAlt size="2rem" />

            <Boxes bg="#404040" border="none" value={truncate((+amount / longPrice.price).toString(), 5)} token={longPrice.name} title="Long" />
            <Boxes
              bg="#404040"
              border="none"
              value={truncate((+amount / shortPrice.price).toString(), 5)}
              token={shortPrice.name}
              title="Short"
            />

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
