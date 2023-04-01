import { Flex, Heading, Text, Image, Button, Link, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import TotalInvestedBar from "./progressBar";

export default function Hero() {
    const { colorMode } = useColorMode();
    const router = useRouter();
    return (
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
                style={{ width: '100%' }}
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
            <Flex direction={{ base: "column", md: "row" }} justify={{ base: "center", lg: "start" }} align={{ base: "center", md: "start" }} mt={{ base: "1.5rem", md: "3rem" }}>
                {process.env.NODE_ENV === "development" ? (
                    <Button
                        variant="primary"
                        boxShadow={colorMode === "dark" ? "0px -1px 22px #518128" : "none"}
                        mr={{ base: "none", md: "0.5rem" }}
                        mb={{ base: "1rem", md: "none" }}
                        onClick={() => router.push("/trade")}>
                        INVEST in $PECTRA
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        boxShadow={colorMode === "dark" ? "0px -1px 22px #518128" : "none"}
                        mr={{ base: "none", md: "0.5rem" }}
                        mb={{ base: "1rem", md: "none" }}
                    >
                        COMING SOON
                    </Button>)}
                <Link
                    href="https://discord.gg/RKNRDVeFwG"
                    isExternal
                    _hover={{ textDecoration: "none" }}
                ><Button variant="secondary">JOIN DISCORD</Button></Link>
            </Flex>
        </Flex>
    )
}