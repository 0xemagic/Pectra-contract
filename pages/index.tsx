import { Flex, Text, Heading } from '@chakra-ui/react'
import { NextSeo } from "next-seo";

export default function Home() {
  return (
    <>
    <NextSeo
      title="Pectra Protocol"
      description="Pair trading made easy."
      openGraph={{
        title: 'Pectra Protocol',
        description: 'Pair trading made easy.',
        images: [
          {
            url: 'https://www.spectraprotocol.com/spectra-protocol.png',
            width: 800,
            height: 600,
            alt: 'Pectra Protocol',
          },
        ],
      }}
    />
    <Flex 
    direction="column" 
    minH="100vh"
    px="4rem"
    >
      <Flex     direction="column" 
mt="9rem">      <Heading variant="hero">
        SWAP ASSETS
      </Heading>
      <Heading color="#ACE075" fontSize="100px" variant="colored" mt="-0.5rem">
      WITH PECTRA
      </Heading>
      <Text textAlign={"start"} mt="3.5rem">
        Pair trading made easy. 
      </Text></Flex>
    </Flex>
    </>
  )
}
