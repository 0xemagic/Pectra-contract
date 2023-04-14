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
    Image,
    useToast
} from '@chakra-ui/react'

import { MdCheckCircle } from 'react-icons/md'
import { useState } from 'react'
import { truncate } from '../utils'
import { useBalance, useAccount, useWaitForTransaction } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { useBuyTokens } from '../hooks/usePublicSale';

import { getErrorMessage } from '../utils/errors';

import { DangerToast, SuccessToast } from "../UI/toasts";

import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { formatUnits, commify } from "@ethersproject/units";
import { BigNumberish } from 'ethers';

export default function BuyTokenModal({ isOpen, onClose }: any) {
    const toast = useToast();
    const { width, height } = useWindowSize();
    const [buySuccess, setBuySuccess] = useState(false);
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState<string>("0");
    const { address } = useAccount();
    const {
        data: tokenBalance,
        isError,
        isLoading: balanceLoading,
    } = useBalance({
        address: address,
        token: "0xA537aF138c1376ea9cC66501a2FfEF62a9c43630",
    });

    const { data, isLoading, isSuccess, write, approveData, isLoadingApprove, isSuccessApprove, writeApprove, isApproved, publicPectraBalance, spectraPrice } = useBuyTokens(
        address!,
        amount
    );

    const handleTokenBuy = async () => {
        if (!isApproved) {
          return;
        }
        try {
          await write?.();
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          toast({
            variant: "danger",
            duration: 5000,
            position: "bottom",
            render: () => <DangerToast message={errorMessage} />,
          });
        }
      };

      const { isLoading: isLoadingBuy } = useWaitForTransaction({
        hash: data && data!.hash,
        enabled: typeof data?.hash === "string",
        onSuccess: (data: any) => {
          if (data!.status === 1) {
            setBuySuccess(true);
            // onClose();
          }
        },
      });

    return (
        <>
        <Modal isCentered
            isOpen={isOpen} onClose={onClose} size="2xl" >
            <ModalOverlay />
            <ModalContent bgColor="#2B3226">
                <ModalHeader>
                    <Flex direction="row" justify="center">
                        <Heading fontSize="25px" variant="heading" color="#BBFF81" mr="0.25rem">$PECTRA</Heading><Heading fontSize="25px" variant="heading">{step === 1 ? "Token Public Sale Terms" : "Token Invest"}</Heading>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody mt="1.5rem" px={{ base: "1rem", md: "2rem" }}>
                    {step === 1 ?
                        <List spacing={5}>
                            <ListItem>
                                <ListIcon as={MdCheckCircle} color='#43931E' />
                                The public sale is priced at $0.025 per $PECTRA token
                            </ListItem>
                            <ListItem>
                                <ListIcon as={MdCheckCircle} color='#43931E' />
                                The token quantity is capped at 116M, equating to a raise of $2.9M 
                            </ListItem>
                            <ListItem>
                                <ListIcon as={MdCheckCircle} color='#43931E' />
                                The public sale vesting terms include a 12 month cliff, followed by a 12 month linear vest
                            </ListItem>
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
                                        flexDir="row"
                                        justifyContent="flex-end"
                                        mb="0.25rem"
                                    >
                                        <NumberInput
                                            as={Flex}
                                            placeholder={"0.0"}
                                            min={0}
                                            step={1000}
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
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        <Flex
                                         bg="#171717"
                                         w="fit-content"
                                         borderWidth="2px"
                                         borderRadius="7px"
                                         align="center"
                                         justifyContent="center"
                                         px="1rem"
                                        >
                                             <Image
                                               src="./icons/usdc.svg" 
                                               w="1.5rem"
                                               mr="0.25rem"
                                               />
                                        <Text fontSize="1.5rem" textAlign="center">
                                               USDC
                                        </Text>
                                        </Flex>
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
                                {+tokenBalance!.formatted! < +amount && (
                                    <Text>
                                        <b>Insufficient balance</b>
                                    </Text>)}
                                <Flex px="1.25rem"
                                >
                                    <Text mr="0.25rem" variant="paragraph">
                                        You will receive
                                    </Text>
                                    <Text variant="paragraph" color="#BBFF81">
                                        <b>{commify((+amount / +formatUnits(spectraPrice as BigNumberish, 6)).toString())}</b> $PECTRA
                                    </Text>
                                </Flex>
                                {/* <Flex mt="0.5rem" px="1.25rem">
                                    <Text mr="0.25rem" variant="paragraph">
                                        Vest unlock date
                                    </Text>
                                    <Text variant="paragraph" color="#BBFF81">
                                        <b>25 / 05 / 2024</b>
                                    </Text>
                                </Flex> */}
                            </>
                        )
                    }
                </ModalBody>
                <ModalFooter mt="1.5rem" >
                    <Flex w="full" direction="row" justify="center">
                        {address !== undefined ?

                            <Button
                            variant="primary"
                            w="fit-content" 
                            mr={3} 
                            disabled={step === 2 && amount === "0" || isLoadingApprove || isLoading}
                            onClick={
                                step === 1 ? () => setStep(2) : !isApproved ? () => writeApprove!() : () => handleTokenBuy()
                            }
                            >
                                {step === 1 ? 'Accept Terms' : !isApproved ? 'Approve USDC' : isLoadingApprove ? 'Approving...' : isLoading ? "Buying..." : 'Buy $PECTRA'}
                            </Button>

                            :
                            <Button variant="primary" w="fit-content" mr={3}>
                                <ConnectButton
                                />
                            </Button>
                        }

                        {step === 1 ? <Button variant="secondary" w="fit-content">Public Sale FAQ</Button> : null}
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>

        <Confetti
        run={buySuccess}
        width={width}
        height={height}
        numberOfPieces={500}
        onConfettiComplete={() => {
          setBuySuccess(false);
        }}/>
        </>
    )
}