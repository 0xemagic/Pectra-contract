import { Flex, Text, Heading, Button, Image } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

export default function Home() {
  return (
    <>
      <NextSeo
        title="Pectra Protocol"
        description="Pair trading made easy."
        openGraph={{
          title: "Pectra Protocol",
          description: "Pair trading made easy.",
          images: [
            {
              url: "https://www.spectraprotocol.com/spectra-protocol.png",
              width: 800,
              height: 600,
              alt: "Pectra Protocol",
            },
          ],
        }}
      />
      <Flex direction="column" minH="80vh" px={{base: "2rem", md: "4rem"}}>
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
            color="#FFFFFF"
            w={{ base: "350px", md: "550px" }}
          >
            Pair trading made easy. Choose a token to short, and a token to
            long. Pectra will automatically set up a pair trade for you. Save gas,
            time, effort. Just trade your favorite pairs.
          </Text>
        </Flex>
        <Flex
          px="1.75rem"
          py="1rem"
          w="fit-content"
          h="66px"
          bg="#192213"
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
          <Image h="58px" src="/icons/arbitrum-text.svg" />
        </Flex>
        <Flex direction="row" mt={{base: "2.5rem", md: "5rem"}}>
          <Button
            variant="primary"
            boxShadow="0px -1px 22px #518128"
            mr="0.5rem"
          >
            START TRADING
          </Button>
          <Button variant="secondary">JOIN DISCORD</Button>
        </Flex>
        <Image
          display={{ base: "none", md: "block" }}
          pos="absolute"
          right="-5rem"
          top="15%"
          h={{ base: "0px", md: "500px", xl: "600px" }}
          minW={{ base: "0px", md: "300px", xl: "600px" }}
          src="/assets/spectra1.svg"
          alt="spectra-protocol-logo"
        />
        <Image
          display={{ base: "none", md: "block" }}
          pos="absolute"
          right="-4rem"
          top="15%"
          h={{ base: "0px", md: "450px", xl: "700px" }}
          minW={{ base: "0px", md: "400px", xl: "800px" }}
          src="/assets/spectra2.svg"
          alt="spectra-protocol-logo"
        />
      </Flex>
    </>
  );
}
