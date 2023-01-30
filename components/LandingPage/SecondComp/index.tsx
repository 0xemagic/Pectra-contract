import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";

const SecondComp = () => {
  const data = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  ];
  return (
    <Box>
      <Heading fontSize={{ base: "2.1875rem", md: "3.125rem" }} variant="hero">
        What we do
      </Heading>
      <Text
        w={{ base: "100%", md: "47.6875rem" }}
        fontFamily="body"
        fontWeight={500}
        fontSize="1.375rem"
        mt="1.8rem"
        mb="4.125rem"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor
        purus aliquet, maximus augue vitae, porta mauris. Aenean id sagittis ex.
      </Text>
      <Grid
        w="full"
        gap="1.75rem"
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      >
        {data.map((item, index) => (
          <GridItem
            py="1.3125rem"
            px="1.875rem"
            bg="#2B3226"
            borderRadius="20px"
            h="13.5rem"
            key={index}
          >
            <Flex justify="space-between" w={"full"} h="full" flexDir="column">
              <Text fontSize={"1.375rem"} fontFamily="body" fontWeight={600}>
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

export default SecondComp;
