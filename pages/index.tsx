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
      <Flex direction="column" minH="100vh" px="4rem">
        <Flex direction="column" mt="6rem">
          {" "}
          <Heading variant="hero">TRADE PAIRS</Heading>
          <Heading
            color="#ACE075"
            fontSize="100px"
            variant="colored"
            mt="-0.5rem"
          >
            WITH PECTRA
          </Heading>
          <Text variant="paragraph" textAlign={"start"} mt="2rem" color="#FFFFFF">
            Pair trading made easy.
          </Text>
        </Flex>
        <Flex px="1.75rem" py="1rem" w="fit-content" h="66px" bg="#192213" direction="row" mt="2rem" borderRadius={"12px"} alignItems="center" justifyItems="center">
            <Text alignSelf="center" mr="0.75rem" variant="paragraph" textAlign={"center"}>
              Available on
            </Text>
            <Image h="58px" src="/icons/arbitrum-text.svg" />
        </Flex>
        <Flex direction="row" mt="5rem">
          <Button
            variant="primary"
            boxShadow="0px -1px 22px #518128"
            mr="0.5rem"
          >
            START TRADING
          </Button>
          <Button variant="secondary">JOIN DISCORD</Button>
        </Flex>
        <Image pos="absolute" right="-6rem" top="15%" h="600px" w="600px" src="/assets/spectra1.svg" alt="spectra-protocol-logo" />
        <Image pos="absolute" right="-3rem" top="15%" h="600px" src="/assets/spectra2.svg" alt="spectra-protocol-logo" />
      </Flex>
    </>
  );
}
