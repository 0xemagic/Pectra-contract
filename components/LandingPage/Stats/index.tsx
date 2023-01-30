import { Heading, Text, VStack } from "@chakra-ui/react";

const Stats = () => {
  return (
    <VStack>
      <Text
        fontFamily="heading"
        fontWeight={500}
        fontSize="1.375rem"
        color="brand"
      >
        SOME STATS
      </Text>
      <Heading fontWeight={500} fontFamily="heading" fontSize="3.125rem">
        TRUSTED BY OVER 7000 TRADERs
      </Heading>
    </VStack>
  );
};

export default Stats;
