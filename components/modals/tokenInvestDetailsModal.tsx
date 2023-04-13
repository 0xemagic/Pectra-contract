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
    Text,
} from '@chakra-ui/react'

import { MdCheckCircle } from 'react-icons/md'
import { useState } from 'react'
import { truncate } from '../utils'
import { useBalance, useAccount } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';

type Props = {
    onCloseDashboard: () => void;
    isOpenDashboard: boolean;
    onOpenBuy: () => void;
}

export default function TokenDetailsModal({ isOpenDashboard, onCloseDashboard, onOpenBuy }: Props) {

    const { address, isConnecting, isDisconnected } = useAccount();
    const {
        data: privateSaleBalance,
        isError: isErrorPrivate,
        isLoading: privateLoading,
    } = useBalance({
        address: address,
        token: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    });

    const {
        data: publicSaleBalance,
        isError: isErrorPublic,
        isLoading: publicLoading,
    } = useBalance({
        address: address,
        token: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    });

    const {
        data: migratorBalance,
        isError: isErrorMigrator,
        isLoading: migratorLoading,
    } = useBalance({
        address: address,
        token: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    });

    const balances =
        [
            [
                privateSaleBalance?.formatted?.toString(),
                "Private Sale"
            ],
            [
                publicSaleBalance?.formatted?.toString(),
                "Public Sale"
            ],
            [
                migratorBalance?.formatted?.toString(),
                "OG Migrator"
            ]
        ]

    const totalBalance = (+migratorBalance?.formatted! + +publicSaleBalance?.formatted! + +privateSaleBalance?.formatted!);

    return (
        <Modal isCentered
            isOpen={isOpenDashboard} onClose={onCloseDashboard} size="2xl">
            <ModalOverlay />
            <ModalContent py="1rem" bgColor="#2B3226" borderRadius="2xl">
                <ModalHeader>
                    <Flex direction="row" justify="center">
                        <Heading fontSize="25px" variant="heading" color="#BBFF81" mr="0.25rem">$PECTRA</Heading><Heading fontSize="25px" variant="heading">TOKEN BALANCE BREAKDOWN</Heading>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody mt="1.5rem" px={{ base: "1rem", md: "2rem" }}>
                    <>
                    <Flex
                                        flexDir="column"
                                        mb="2.25rem"
                                        // mt="1.5rem"
                                        alignItems="center"
                                        justifyItems="center"
                                    >
                                        <Text
                                            variant="paragraph"
                                            fontSize="0.85rem"
                                            color="#FFFFFF"
                                            opacity="0.7"
                                        >
                                            Total Token Value
                                        </Text>
                                        <Flex direction="column" alignItems="center" justifyItems="center">
                                            <Heading variant="heading" fontSize={{ base: "1.5rem", md: "2rem" }}>
                                               ${totalBalance
                                                ? truncate(totalBalance.toString(), 2)
                                                : 0}
                                                </Heading>
                                        </Flex>
                                    </Flex>
                        <Flex
                            fontFamily="body"
                            direction="row"
                            alignItems="center"
                            justifyContent="space-around"
                            w="full"
                        >
                            {balances.map((balance, index) => {
                                return (
                                    <Flex
                                        flexDir="column"
                                        mb="0.25rem"
                                        alignItems="center"
                                        justifyItems="center"
                                    >
                                        <Text
                                            variant="paragraph"
                                            fontSize="0.85rem"
                                            color="#FFFFFF"
                                            opacity="0.7"
                                        >
                                            {balance[1]}
                                        </Text>
                                        <Flex direction="column" alignItems="center" justifyItems="center">
                                            <Heading variant="heading" fontSize={{ base: "1.5rem", md: "2rem" }}> {balance[0]
                                                ? truncate(balance[0], 2)
                                                : 0}</Heading>
                                            <Heading mt="0.25rem" variant="heading" color="#81FF7E" fontSize={{ base: "0.5rem", md: "1.25rem" }}>                                        $PECTRA
                                            </Heading>
                                        </Flex>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </>
                </ModalBody>
                <ModalFooter mt="1.5rem" >
                    <Flex w="full" direction="row" justify="center">
                        <Button variant="primary" w="fit-content" mr={3} onClick={() => {
                            onCloseDashboard(),
                                onOpenBuy()
                        }}>
                            BUY MORE $PECTRA
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}