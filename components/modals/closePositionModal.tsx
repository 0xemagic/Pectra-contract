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
    InputLeftElement,
  } from "@chakra-ui/react";
  
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
    long,
    short,
    leverage,
    collateral,
    entry,
    liquidation,
    pnl,
    netvalue,
    size
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
          <ModalHeader>Close Trade</ModalHeader>
          <ModalCloseButton />
          <ModalBody w="full">
            <Flex as={Flex} direction="column" px="1.5rem" py="1rem" alignItems="center">

            <InputGroup>
                <InputLeftElement
                ml="1rem"
                pointerEvents='none'>Close</InputLeftElement>
                <Input  type='number' placeholder='Amount' />
            </InputGroup>
            <Text alignSelf="end" variant="paragraph">Max Amount: {netvalue}</Text>
  
              <BiDownArrowAlt size="2rem" />

              <Boxes
                bg="#404040"
                border="none"
                value={netvalue}
                token={long}
                title="Long"
              />
  
              <Boxes
                bg="#404040"
                border="none"
                value={netvalue}
                token={short}
                title="Short"
              />
  
              <Flex mt="1rem" mb="1rem" direction="column" w="full">
                <Values title="Collateral Token" value="USDC" />
                <Values title="Collateral Value" value={`$${collateral}`} />
                <Values title="Leverage" value={`${leverage}x`} />
                {/* <Values title="Position Value" value={`$${+amount * leverage}`} />
                <Values
                  title="Liquidation Price"
                  value={`$${truncate(
                    (longPrice.price / shortPrice.price).toString(),
                    5
                  )}`}
                /> */}
                <Values title="Fees" value="0.3$" />
              </Flex>
  
              <Button variant="secondary" 
              onClick={() => console.log("works")}>
              {/* // {() => write?.()}> */}
                Close Position
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  
  export default OpenPositionModal;
  