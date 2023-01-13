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
    <Flex direction="column" minH="100vh">
      <Heading variant="hero">
        SWAP ASSETS
      </Heading>
      <Heading fontSize="100px" variant="colored">
      WITH PECTRA
      </Heading>
      <Text>
        Pair trading made easy. 
      </Text>
    </Flex>
    </>
  )
}
