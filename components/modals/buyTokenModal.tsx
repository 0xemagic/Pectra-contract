import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Heading,
    Flex,
    List,
    ListItem,
    ListIcon,
    Text,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from '@chakra-ui/react'

import { MdCheckCircle } from 'react-icons/md'
import { useState } from 'react'
import { truncate } from '../utils'
import { useBalance, useAccount } from "wagmi";

export default function BuyTokenModal({ isOpen, onClose }: any) {

    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState<string>("0");
    const { address, isConnecting, isDisconnected } = useAccount();
    const {
        data: tokenBalance,
        isError,
        isLoading: balanceLoading,
    } = useBalance({
        address: address,
        token: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    });

    console.log(address)

    return (
        <Modal isCentered
            isOpen={isOpen} onClose={onClose} size="2xl" >
            <ModalOverlay />
            <ModalContent bgColor="#2B3226">
                <ModalHeader>
                    <Flex direction="row" justify="center">
                        <Heading fontSize="25px" variant="heading" color="#BBFF81" mr="0.25rem">$PECTRA</Heading><Heading fontSize="25px" variant="heading">{step === 1 ? "Token Public Sales Terms" : "Token Invest"}</Heading>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody mt="1.5rem" px={{ base: "1rem", md: "2rem" }}>
                    {step === 1 ?
                        <List spacing={5}>
                            <ListItem>
                                <ListIcon as={MdCheckCircle} color='#43931E' />
                                Vesting term is 12 months - until then, your tokens will be locked in the contract (untradable)                        </ListItem>
                            <ListItem>
                                <ListIcon as={MdCheckCircle} color='#43931E' />
                                Public sales initial price starts at $0.025 per $PECTRA token                        </ListItem>
                            <ListItem>
                                <ListIcon as={MdCheckCircle} color='#43931E' />
                                Token quantity is capped at 100M - capped raise is at $1,250,000                        </ListItem>
                        </List> :
                        (
                            <>
                                <Flex
                                    fontFamily="body"
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
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
                                            borderWidth="2px"
                                            borderRadius="7px"
                                            py="0.875rem"
                                            px="1.25rem"
                                            direction="row"
                                            alignItems="center"
                                        >
                                            <NumberInputField
                                                onChange={(e) => setAmount(e.target.value.toString())}
                                                textAlign="center"
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
                                <Flex                                             px="1.25rem"
>
                                <Text mr="0.25rem" variant="paragraph">
                                    You will receive
                                </Text>
                                <Text variant="paragraph" color="#BBFF81">
                                <b>{+amount * 0.025}</b> $PECTRA
                                </Text>
                                </Flex>
                                <Flex mt="0.5rem" px="1.25rem">
                                <Text mr="0.25rem" variant="paragraph">
                                    Vest unlock date
                                </Text>
                                <Text variant="paragraph" color="#BBFF81">
                                <b>25 / 05 / 2024</b>
                                </Text>
                                </Flex>
                            </>
                        )
                    }
                </ModalBody>
                <ModalFooter mt="1.5rem" >
                    <Flex w="full" direction="row" justify="center">

                        <Button variant="primary" w="fit-content" mr={3} onClick={() => setStep(2)}>
                            {step === 1 ? 'Accept Terms' : 'Invest in $PECTRA'}
                        </Button>
                        <Button variant="secondary" w="fit-content">Public Sales Deck</Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}