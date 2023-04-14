import {
    Button,
    Flex,
    Heading,
    Image,
    List,
    ListIcon,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
    useToast,
} from "@chakra-ui/react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { MdCheckCircle } from "react-icons/md";
import { useAccount, useContractRead, useWaitForTransaction } from "wagmi";
import { truncate } from "../utils";

import { useBuyTokens } from "../hooks/usePublicSale";
import { SALES_CONTRACT, USDC } from "../hooks/usePublicSale";
import erc20ABI from "../../public/abi/erc20.json";

import { getErrorMessage } from "../utils/errors";

import { DangerToast, SuccessToast } from "../UI/toasts";

import { commify, formatUnits } from "@ethersproject/units";
import { BigNumberish } from "ethers";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

export default function BuyTokenModal({ isOpen, onClose }: any) {
    const toast = useToast();
    const { width, height } = useWindowSize();
    const [buySuccess, setBuySuccess] = useState(false);
    const [approveSuccess, setApproveSuccess] = useState(false);
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState<string>("0");
    const { address } = useAccount();

    const {
        data,
        isLoading,
        isSuccess,
        write,
        approveData,
        approveStatus,
        isLoadingApprove,
        isSuccessApprove,
        writeApprove,
        isApproved,
        publicPectraBalance,
        spectraPrice,
        isPaused,
        usdcBalance
    } = useBuyTokens(address!, amount);

    const insufficientBalance = usdcBalance && +formatUnits(usdcBalance!.value!, 6) < +amount;

    useEffect(() => {
        const interval = setInterval(() => {
            if (amount !== "0.0"){
            setAmount(amount)
            }
            console.log(isApproved, "yes")
        }, 3000);

        return () => clearInterval(interval);
    }, [isLoadingApprove])

    useEffect(() => {
        if (isApproved && approveSuccess) {
          toast({
            variant: "success",
            duration: 5000,
            position: "bottom",
            render: () => (
              <SuccessToast message={`You have approved ${amount} USDC`} />
            ),
          });
        }
        setAmount(amount);
      }, [approveSuccess, isApproved]);

    const handleTokenBuy = async () => {
        // if (!isApproved) {
        //     console.log("YES")
        //     return;
        // }
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

    const { isLoading: isLoadApprove } = useWaitForTransaction({
        hash: approveData && approveData!.hash,
        enabled: typeof approveData?.hash === "string",
        onSuccess: (data: any) => {
            if (data!.status === 1) {
                setApproveSuccess(true);
                // onClose();
            }
        },
    });

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
            <Modal isCentered isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalOverlay />
                <ModalContent bgColor="#2B3226">
                    <ModalHeader>
                        <Flex direction="row" justify="center">
                            <Heading
                                fontSize="25px"
                                variant="heading"
                                color="#BBFF81"
                                mr="0.25rem"
                            >
                                $PECTRA
                            </Heading>
                            <Heading fontSize="25px" variant="heading">
                                {isPaused
                                    ? "BUY"
                                    : step === 1
                                        ? "Token Public Sale Terms"
                                        : "Buy Token"}
                            </Heading>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mt="1.5rem" px={{ base: "1rem", md: "2rem" }}>
                        <>
                            {isPaused ? (
                                <Text textAlign="center" variant="paragraph">
                                    Public sale is currently paused
                                </Text>
                            ) : (
                                <>
                                    {step === 1 ? (
                                        <List spacing={5}>
                                            <ListItem>
                                                <ListIcon as={MdCheckCircle} color="#43931E" />
                                                The public sale is priced at $0.025 per $PECTRA token
                                            </ListItem>
                                            <ListItem>
                                                <ListIcon as={MdCheckCircle} color="#43931E" />
                                                The token quantity is capped at 100M, equating to a
                                                raise of $2.5M
                                            </ListItem>
                                            <ListItem>
                                                <ListIcon as={MdCheckCircle} color="#43931E" />
                                                The public sale vesting terms include a 12 month cliff,
                                                followed by a 12 month linear vest
                                            </ListItem>
                                        </List>
                                    ) : (
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
                                                        // isInvalid={insufficientBalance}
                                                        allowMouseWheel
                                                        inputMode="numeric"
                                                        bg="#171717"
                                                        w="full"
                                                        borderWidth="2px"
                                                        borderRadius="7px"
                                                        border={insufficientBalance ? "2px solid red" : "2px solid inherit"}
                                                        py="0.875rem"
                                                        px="1.25rem"
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <NumberInputField
                                                            onChange={(e) =>
                                                                setAmount(e.target.value.toString())
                                                            }
                                                            border="none"
                                                            textAlign="center"
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
                                                <Flex w="100%" justifyContent={insufficientBalance ? "space-between" : "end"}>
                                                    {insufficientBalance && (
                                                        <Text ml="1.25rem"
                                                            variant="paragraph"
                                                            color="red">
                                                            <b>Insufficient balance</b>
                                                        </Text>
                                                    )}
                                                    <Text
                                                        variant="paragraph"
                                                        fontSize="0.85rem"
                                                        alignSelf="end"
                                                        justifySelf="end"
                                                        mr="1.25rem"
                                                        color="#FFFFFF"
                                                        opacity="0.7"
                                                    >
                                                        Wallet Balance:{" "}
                                                        <b>
                                                            {usdcBalance
                                                                ? truncate(usdcBalance!.formatted!.toString(), 2)
                                                                : 0}
                                                        </b>{" "}
                                                        USDC
                                                    </Text>
                                                </Flex>
                                            </Flex>

                                            <Flex pt="2rem" px="1.25rem" justifyContent="center" alignItems="center" direction="column">
                                                <Text mr="0.25rem" variant="paragraph">
                                                    You will receive
                                                </Text>
                                                <Flex direction="row" alignItems="end">
                                                    <Heading mr="0.5rem" variant="heading">
                                                        <b>
                                                            {commify(
                                                                (
                                                                    +amount /
                                                                    +formatUnits(spectraPrice as BigNumberish, 6)
                                                                ).toString()
                                                            )}
                                                        </b>
                                                    </Heading>
                                                    <Heading variant="heading" fontSize={{ base: "1.25rem", md: "1.5rem" }} color="#BBFF81">
                                                        $PECTRA
                                                    </Heading>
                                                </Flex>
                                            </Flex>
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    </ModalBody>
                    <ModalFooter mt="1.5rem">
                        <Flex w="full" direction="row" justify="center">
                            {address !== undefined ? (
                                <>
                                <Button
                                    display={isApproved && step !== 1 ? "none" :  "flex"}
                                    variant="primary"
                                    w="fit-content"
                                    mr={3}
                                    disabled={
                                        (step === 2 && amount === "0") ||
                                        isLoadingApprove 
                                        // || isApproved
                                    }
                                    onClick={
                                        step === 1 ? () => setStep(2) : !isApproved ? () => writeApprove!() : () => {}
                                    }
                                >
                                    {isPaused
                                        ? "COMING SOON"
                                        : step === 1
                                            ? "Accept Terms"
                                            : !isApproved
                                                ? "Approve USDC" : "BUYING..."}
                                </Button>
                                <Button
                                    display={!isApproved || step === 1 ? "none" : "flex"}
                                    variant="primary"
                                    w="fit-content"
                                    disabled={
                                        (step === 2 && amount === "0") ||
                                        step === 1 ||
                                        isLoadingApprove ||
                                        !isApproved
                                    }
                                    onClick={() => handleTokenBuy()}
                                >
                                    BUY $PECTRA
                                </Button>
                                </>
                                ) : (
                                <Button variant="primary" w="fit-content" mr={3}>
                                    <ConnectButton />
                                </Button>
                            )}

                            {step === 1 ? (
                                <Button variant="secondary" w="fit-content">
                                    Public Sale FAQ
                                </Button>
                            ) : null}
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
                }}
            />
        </>
    );
}
