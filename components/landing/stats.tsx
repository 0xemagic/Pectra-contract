import { Grid, GridItem, Heading, Image, Text, VStack, useColorMode } from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
const Stats = () => {
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
    {
      label: "TOTAL TRADING VOLUME",
      value: "COMING SOON",
      time: "Last 24H",
    },
    {
      label: "TRADES",
      value: "COMING SOON",
      time: "Last 24H",
    },
    {
      label: "OPEN INTEREST",
      value: "COMING SOON",
      time: "Last 24H",
    },
  ];
  return (
    <VStack pt="10rem">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: -100 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1 },
          },
        }}
      >
        <Text
          fontFamily="heading"
          fontWeight={500}
          fontSize="1.375rem"
          color="brand"
          textAlign="center"
        >
          SOME STATS
        </Text>
        <Heading
          mb="4.375rem!important"
          fontWeight={500}
          fontFamily="heading"
          fontSize="3.125rem"
          textAlign={{ base: "center", lg: "left" }}
        >
          TRUSTED BY LEADING TRADERS
        </Heading>
      </motion.div>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1 },
          },
        }}
      >
        <Grid
          w="full"
          minW="100%"
          gap="0.75rem"
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
        >
          {data.map(({ label, value, time }, index) => (
            <GridItem
              py="2.3125rem"
              position="relative"
              borderRadius="20px"
              bg={colorMode === "dark" ? "#182310" : "#FCFCFC"}
              h="17rem"
              w="100%"
              key={index}
            >
              <VStack w="full" h="full">
                <Text
                  lineHeight="22px"
                  color="brand"
                  fontFamily="heading"
                  fontWeight={500}
                  fontSize="1.375rem"
                  textAlign={{ base: "center", lg: "left" }}
                >
                  {label}
                </Text>
                <Text
                  my="12px"
                  fontFamily="body"
                  fontWeight={500}
                  fontSize={{ base: "3rem", md: "2rem" }}
                  textAlign={{ base: "center", lg: "left" }}
                >
                  {value}
                </Text>
                <Text
                  lineHeight="22px"
                  color="brand"
                  fontFamily="heading"
                  fontWeight={500}
                  fontSize="1.375rem"
                >
                  {time}
                </Text>
                <Image
                  left={0}
                  borderBottomLeftRadius="20px"
                  bottom={0}
                  position="absolute"
                  src="/icons/stats-icon.png"
                  alt="stats"
                />
              </VStack>
            </GridItem>
          ))}
        </Grid>
      </motion.div>
    </VStack>
  );
};

export default Stats;
