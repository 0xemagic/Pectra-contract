import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  useColorMode,
} from "@chakra-ui/react";

const About = () => {
  const { colorMode } = useColorMode();
  const data = [
    "Fast and simple user experience for retail and institutional traders.",
    "Deep liquidity through our on-chain oracle-based partners.",
    "Fully composable, building at the intersection of DeFi and NFTs.",
    "Completely decentralized, on-chain, and self-custodial.",
    "Go long, short, or remain market neutral through convenient spread trading.",
    "Pairs trading enables precise speculation on the latest crypto narratives."
  ];
  return (
    <Box pt="10rem">
      <Heading fontSize={{ base: "2.1875rem", md: "3.125rem" }} variant="hero">
     Leveraged Pairs Trading
      </Heading>
      <Text
        w={{ base: "100%", md: "47.6875rem" }}
        fontFamily="body"
        fontWeight={500}
        fontSize="1.375rem"
        mt="1.8rem"
        mb="4.125rem"
      >
        Trade assets like BTC and ETH against one another in a single trade.
      </Text>
      <Grid
        w="full"
        gap="1.75rem"
        templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(3, 1fr)" }}
      >
        {data.map((item, index) => (
          <GridItem
            py="1.3125rem"
            px="1.875rem"
            bg={colorMode === 'dark' ? "#2B3226" : "#F4F4F4"}
            borderRadius="20px"
            h={{base: "10rem", xl: "12rem"}}
            key={index}
          >
            <Flex justify="space-between" w={"full"} h="full" flexDir="column">
              <Text fontSize={"1.35rem"} fontFamily="body" fontWeight={400}>
                {item}
              </Text>
              <Flex gap="0.65rem" w="fit-content" alignItems="center">
                <Image
                  w="2.5rem"
                  h="2.18rem"
                  src="/icons/spectra.svg"
                  alt="spectra-protocol-logo"
                />
                <Text fontFamily="heading" fontWeight={500} fontSize="1.08rem">
                  PECTRA
                </Text>
              </Flex>
            </Flex>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default About;
