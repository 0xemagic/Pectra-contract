import { Flex, Heading, Text, Image, Button, Link, useColorMode, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import TotalInvestedBar from "./progressBar";
import { useState } from "react";

import BuyTokenModal from "../modals/buyTokenModal";

export default function Hero() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { colorMode } = useColorMode();
    const router = useRouter();

    return (
        <>
        <Flex direction="column" minH="80vh" px={{ base: "2rem", md: "4rem" }} align="center">
            <Flex direction="column" w="full" align="center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { duration: 1, delay: 0.5 },
                        },
                    }}
                >
                    <Image
                        src="./assets/spectra-logo-dark.svg"
                        w="300px"
                        h="250px"
                        m="auto"
                    />
                    <Flex alignItems="center" wrap="nowrap">
                        <Heading
                            color="#43931E"
                            fontSize={{ base: "2rem", md: "4rem" }}
                            variant="colored"
                            mt="-0.5rem"
                            textAlign={{ base: "center", lg: "start" }}
                            mr="1rem"
                        >
                            Pectra
                        </Heading>
                        <Heading
                            color="#ACE075"
                            fontSize={{ base: "2rem", md: "4rem" }}
                            variant="colored"
                            mt="-0.5rem"
                            textAlign={{ base: "center", lg: "start" }}
                        >
                            Protocol
                        </Heading>
                    </Flex>
                </motion.div>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    style={{ marginTop: '-1rem' }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { duration: 1, delay: 1 },
                        },
                    }}
                >
                    <Text
                        variant="paragraph"
                        textAlign="center" mt={{ base: "2.5rem", md: "2rem" }}
                        w={{ base: "fit-content", md: "fit-content", lg: "550px" }}
                        fontWeight="500"
                    >
                        Invest in the first narrative-driven pair trading platform          </Text>
                </motion.div>
            </Flex>
            <motion.div
                initial="hidden"
                animate="visible"
                style={{ width: '100%', marginTop: "1.25rem" }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { duration: 1, delay: 1 },
                    },
                }}
            >
                <TotalInvestedBar />
            </motion.div>
            <Flex alignItems="center" wrap="nowrap">
            <Heading mt="1rem" variant="heading">PUBLIC SALE ENDS IN:</Heading>
            <Heading mt="1rem" variant="heading" ml="1rem" color="#81FF7E">00D / 00H  / 00M</Heading>
            </Flex>
            <Flex direction={{ base: "column", md: "row" }} justify={{ base: "center", lg: "start" }} align={{ base: "center", md: "start" }} mt="2rem">
                    <Button
                        variant="primary"
                        boxShadow={colorMode === "dark" ? "0px -1px 22px #518128" : "none"}
                        mr={{ base: "none", md: "0.5rem" }}
                        mb={{ base: "1rem", md: "none" }}
                        onClick={() => onOpen()}
                        >
                        INVEST in $PECTRA
                    </Button>
                <Link
                    href="https://discord.gg/RKNRDVeFwG"
                    isExternal
                    _hover={{ textDecoration: "none" }}
                ><Button variant="secondary">JOIN DISCORD</Button></Link>
            </Flex>
        </Flex>
        {isOpen && <BuyTokenModal isOpen={isOpen} onClose={onClose} />}
        </>
    )
}