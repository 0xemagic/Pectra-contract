import { Flex, Heading, Text, Image, Button, Link, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Hero() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  return (
    <Flex direction="column" minH="80vh">
      <Flex direction="column" mt={{base: "4rem", lg: "2rem"}} w="full" justify={{base: "center", lg: "start"}}>
        {" "}
        <Heading fontSize={{ base: "2.75rem", md: "6rem" }} variant="hero" textAlign={{base: "center", lg: "start"}}>
          RIDE THE<br/> NARRATIVE
        </Heading>
        <Heading
          color="#ACE075"
          fontSize={{ base: "3rem", md: "6rem" }}
          variant="colored"
          mt="-0.5rem"
          textAlign={{base: "center", lg: "start"}}
        >
          WITH PECTRA
        </Heading>
        <Text
          variant="paragraph"
          textAlign={{base: "center", lg: "start"}}          mt={{ base: "2.5rem", md: "2rem" }}
          w={{ base: "fit-content", md: "fit-content", lg: "550px" }}
          fontWeight="500"
        >
          The home of one-click decentralized pairs trading. Trade the latest narratives by choosing one token to long and one to short with up to XX leverage.
        </Text>
      </Flex>
      <Flex
        px="1rem"
        py="1rem"
        w="fit-content"
        h="66px"
        bg={colorMode === "dark" ? "#192213" : "linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))"}
        direction="row"
        mt="2rem"
        borderRadius={"12px"}
        alignItems="center"
        alignSelf={{base: "center", lg: "start"}}
      >
        <Text
          alignSelf="center"
          mr="0.75rem"
          variant="paragraph"
          textAlign={{base: "center", lg: "left"}}
        >
          Available on
        </Text>
        <Image ml={colorMode === "dark" ? "-0.25rem" : "-0.75rem"} h="58px" src={colorMode === "dark" ? "/icons/arbitrum-dark.svg" : "/icons/arbitrum-light.svg"} />
      </Flex>
      <Flex direction={{ base: "column", md: "row" }} justify={{base: "center", lg: "start"}}align={{ base: "center", md: "start" }} mt={{ base: "1.5rem", md: "3rem" }}>
        <Button
          variant="primary"
          boxShadow={colorMode === "dark" ? "0px -1px 22px #518128" : "none"}
          mr={{ base: "none", md: "0.5rem" }}
          mb={{ base: "1rem", md: "none" }}
           onClick={() => router.push("/trade")}> 
          START TRADING
        </Button>
        <Link
          href="https://discord.gg/RKNRDVeFwG"
          isExternal
          _hover={{ textDecoration: "none" }}
        ><Button variant="secondary">JOIN DISCORD</Button></Link>
      </Flex>
      <Image
        display={{ base: "none", lg: "block" }}
        pos="absolute"
        right={{lg: "-7rem", xl: "0rem"}}
        top={{base: "15%", md: "5%", lg: "5%", xl: "2.5%", "2xl": "-1.5%"}}
        h={{ base: "0px", md: "500px", lg: "400px", xl: "600px", "2xl": "600px" }}
        minW={{ base: "0px", md: "300px", xl: "400px", "2xl": "500px" }}
        src={colorMode === "dark" ? "/assets/spectra1.svg" : "/assets/spectra1-light.svg"}
        alt="spectra-protocol-logo"
      />
      <Image
        display={{ base: "none", lg: "block" }}
        pos="absolute"
        right={{lg: "-9rem", "2xl": "-4rem"}}
        top={{lg: "4%", xl: "6%", "2xl": "1%"}}
        h={{ base: "0px", md: "350px", lg: "450px", xl: "500px", "2xl": "600px" }}
        minW={{ base: "0px", md: "400px", xl: "800px" }}
        src={colorMode === "dark" ? "/assets/spectra2.svg" : "/assets/spectra2-light.svg"}
        alt="spectra-protocol-logo"
      />
    </Flex>
  )
}