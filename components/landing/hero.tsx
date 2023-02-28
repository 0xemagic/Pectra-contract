import { Flex, Heading, Text, Image, Button, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Hero() {
    const { colorMode } = useColorMode();
    const router = useRouter();
    return (
        <Flex direction="column" minH="80vh">
        <Flex direction="column" mt="6rem" w="full">
          {" "}
          <Heading fontSize={{ base: "2.75rem", md: "6rem" }} variant="hero" >
            TRADE PAIRS
          </Heading>
          <Heading
            color="#ACE075"
            fontSize={{ base: "3rem", md: "6rem" }}
            variant="colored"
            mt="-0.5rem"
          >
            WITH PECTRA
          </Heading>
          <Text
            variant="paragraph"
            textAlign={"start"}
            mt={{base: "2.5rem", md: "2rem"}}
            w={{ base: "350px", md: "550px" }}
            fontWeight="500"
          >
            Introducing one-click decentralized pair trading. Choose one token to long, and one to short - Pectra automates the rest. Now you can simply trade crypto pairs with up to XX leverage.
          </Text>
        </Flex>
        <Flex
          px="1.75rem"
          py="1rem"
          w="fit-content"
          h="66px"
          bg={colorMode === "dark" ? "#192213" : "linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))"}
          direction="row"
          mt="2rem"
          borderRadius={"12px"}
          alignItems="center"
          justifyItems="center"
        >
          <Text
            alignSelf="center"
            mr="0.75rem"
            variant="paragraph"
            textAlign={"center"}
          >
            Available on
          </Text>
          <Image ml={colorMode === "dark" ? "-0.25rem" : "-0.75rem"} h="58px" src={colorMode === "dark" ? "/icons/arbitrum-dark.svg" : "/icons/arbitrum-light.svg"} />
        </Flex>
        <Flex direction={{base: "column", md: "row"}} align={{base: "center", md: "start"}} mt={{base: "2.5rem", md: "5rem"}}>
          <Button
            variant="primary"
            boxShadow={colorMode === "dark" ? "0px -1px 22px #518128" : "none"}
            mr={{base: "none", md: "0.5rem"}}
            mb={{base: "1rem", md: "none"}}
            onClick={() => router.push("/trade")}
          >
            START TRADING
          </Button>
          <Button variant="secondary">JOIN DISCORD</Button>
        </Flex>
        <Image
          display={{ base: "none", md: "block" }}
          pos="absolute"
          right="0rem"
          top="2%"
          h={{ base: "0px", md: "500px", xl: "400px", "2xl": "500px" }}
          minW={{ base: "0px", md: "300px", xl: "400px", "2xl": "500px" }}
          src={colorMode === "dark" ? "/assets/spectra1.svg" : "/assets/spectra1-light.svg"}
          alt="spectra-protocol-logo"
        />
        <Image
          display={{ base: "none", md: "block" }}
          pos="absolute"
          right="-4rem"
          top="2%"
          h={{ base: "0px", md: "450px", xl: "550px", "2xl": "600px" }}
          minW={{ base: "0px", md: "400px", xl: "800px" }}
          src={colorMode === "dark" ? "/assets/spectra2.svg" : "/assets/spectra2-light.svg"}
          alt="spectra-protocol-logo"
        />
      </Flex>
    )
}