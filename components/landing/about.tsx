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

import { useEffect } from "react";

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const About = () => {
  const { colorMode } = useColorMode();
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const data = [
    "Go long, short, or remain market neutral through convenient spread trading.",
    "Deep liquidity through our on-chain oracle-based partners.",
    "Fully composable and self-custodial, building at the intersection of DeFi and NFTs.",
  ];
  return (
    <Box pt="10rem">
       <motion.div
             ref={ref}
             initial="hidden"
             animate={controls}
             variants={{
               hidden: { opacity: 0, x: -100 },
               visible: {
                 opacity: 1,
                 x: 0,
                 transition: { duration: 1 },
               },
             }}
           >
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
      </motion.div>
      <Grid
        w="full"
        gap="1.75rem"
        templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(3, 1fr)" }}
      >
          {data.map((item, index) => (
             <motion.div
             ref={ref}
             initial="hidden"
             animate={controls}
             variants={{
               hidden: { opacity: 0, x: 100 },
               visible: {
                 opacity: 1,
                 x: 0,
                 transition: { duration: 1 },
               },
             }}
             key={index}
           >
            <GridItem
              py="1.3125rem"
              px="1.875rem"
              bg={colorMode === 'dark' ? "#2B3226" : "#F4F4F4"}
              borderRadius="20px"
              h={{ base: "15rem", md: "10rem", lg: "13rem", xl: "12rem" }}
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
            </motion.div>
          ))}
      </Grid>
    </Box>
  );
};

export default About;
