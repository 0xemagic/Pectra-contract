import { Grid, GridItem, Heading, Image, Text, VStack } from "@chakra-ui/react";

const Stats = () => {
  const data = [
    {
      label: "TOTAL TRADING VOLUME",
      value: "$70,303,155",
      time: "Last 24H",
    },
    {
      label: "TRADES",
      value: "211,122",
      time: "Last 24H",
    },
    {
      label: "OPEN INTEREST",
      value: "$70,303,155",
      time: "Last 24H",
    },
  ];
  return (
    <VStack pt="10rem">
      <Text
        fontFamily="heading"
        fontWeight={500}
        fontSize="1.375rem"
        color="brand"
      >
        SOME STATS
      </Text>
      <Heading
        mb="4.375rem!important"
        fontWeight={500}
        fontFamily="heading"
        fontSize="3.125rem"
      >
        TRUSTED BY OVER 7000 TRADERs
      </Heading>
      <Grid
        w="full"
        gap="0.75rem"
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      >
        {data.map(({ label, value, time }, index) => (
          <GridItem
            py="2.3125rem"
            position="relative"
            borderRadius="20px"
            bg="#182310"
            h="12.5rem"
            key={index}
          >
            <VStack w="full" h="full">
              <Text
                lineHeight="22px"
                color="brand"
                fontFamily="heading"
                fontWeight={500}
                fontSize="1.375rem"
              >
                {label}
              </Text>
              <Text
                my="12px"
                fontFamily="body"
                fontWeight={500}
                fontSize="3rem"
              >
                {value}
              </Text>
              <Text
                lineHeight="22px"
                color="#DAFFB2"
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
    </VStack>
  );
};

export default Stats;
