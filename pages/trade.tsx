import ShortLongComp from "@/components/ShortLongComp";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Select,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";

const Trade = () => {
  return (
    <>
      <Flex gap={5} w="full" fontFamily={"heading"}>
        <VStack w="27.625rem" gap={3}>
          <Box
            h="fit-content"
            w="full"
            borderRadius={"0.5rem"}
            background="#1E1E1E"
            fontWeight="bold"
            px="1.68rem"
            py="1.5rem"
            fontSize="1.25rem"
          >
            TRADE
          </Box>
          <Box
            w="full"
            borderRadius={"0.5rem"}
            background="#1E1E1E"
            fontStyle="body"
            px="1.68rem"
            py="1.25rem"
          >
            <ShortLongComp />
          </Box>
        </VStack>

        <VStack gap={3} flex={1}>
          <Box
            h="fit-content"
            w="full"
            borderRadius={"0.5rem"}
            background="#1E1E1E"
            px="1.68rem"
            py="1.15rem"
            fontSize="1.25rem"
          >
            <Select variant="outline" placeholder={`"BTC/ETH"`} />
          </Box>

          <Box
            w="full"
            px="1.68rem"
            py="1.15rem"
            fontSize="1.25rem"
            borderRadius={"0.5rem"}
            background="#1E1E1E"
          >
            {" "}
            Charts
          </Box>
          <Box
            px="1.68rem"
            py="1.15rem"
            fontSize="1.25rem"
            w="full"
            borderRadius={"0.5rem"}
            background="#1E1E1E"
          >
            Open Positions
          </Box>
        </VStack>
      </Flex>
    </>
  );
};

export default Trade;
