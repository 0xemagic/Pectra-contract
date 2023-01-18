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
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={5}
        w="full"
        templateRows="repeat(2, 1fr)"
        fontFamily={"heading"}
      >
        <GridItem
          w="full"
          borderRadius={"0.5rem"}
          background="#1E1E1E"
          colSpan={1}
          fontWeight="bold"
          rowSpan={1}
          px="1.68rem"
          py="1.5rem"
          fontSize="1.25rem"
        >
          TRADE
        </GridItem>

        <GridItem
          w="full"
          borderRadius={"0.5rem"}
          background="#1E1E1E"
          rowSpan={1}
          colSpan={2}
          px="1.68rem"
          py="1.5rem"
          fontSize="1.25rem"
        >
          <Select variant="outline" placeholder={`"BTC/ETH"`} />
        </GridItem>

        <GridItem
          w="full"
          borderRadius={"0.5rem"}
          background="#1E1E1E"
          colSpan={1}
          fontStyle="body"
          rowSpan={2}
          px="1.68rem"
          py="1.25rem"
        >
          <Tabs borderRadius="2xl" isFitted variant="unstyled">
            <TabList borderRadius="7px" bg="#303030">
              <Tab
                _selected={{
                  bg: "#444444",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  borderWidth: "2px",
                  borderRadius: "7px",
                }}
              >
                Open
              </Tab>
              <Tab
                _selected={{
                  bg: "#444444",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  borderWidth: "2px",
                  borderRadius: "7px",
                }}
              >
                Close
              </Tab>
            </TabList>
          </Tabs>
          <Text
            fontFamily="body"
            color="#ffffff"
            fontSize="1.06rem"
            mt="1.8125rem"
            mb="1.25rem"
            fontWeight="600"
          >
            Pick a pair
          </Text>
         <VStack gap='0.825rem'>
         <Box
            bg="rgba(172, 224, 117, 0.2)"
            w="full"
            borderColor="#ACE075"
            borderWidth="2px"
            borderRadius="7px"
            py="0.875rem"
            px="1.25rem"
          >
            <Flex
              fontFamily="body"
              justify="space-between"
              alignItems="center"
              w="full"
            >
              <Text fontWeight={600} fontFamily="heading" fontSize="0.9rem">
                LONG
              </Text>
              <Flex gap="0.75rem" flexDir="column" justifyContent="flex-end">
                <Select
                  fontWeight={600}
                  fontSize="1.01rem"
                  w="fit-content"
                  ml="auto"
                  mr={0}
                  variant="unstyled"
                  placeholder={"1 ETH"}
                >
                  <option value="1 eth">1 ETH</option>
                </Select>
                <Flex ml="auto" mr={0} fontSize="0.875rem">
                  <Text mr={2} fontWeight={300}>
                    current price:
                  </Text>
                  <Text fontWeight={600}>$1200</Text>
                </Flex>
              </Flex>
            </Flex>
          </Box>
          <Box
            bg="rgba(255, 114, 114, 0.2)"
            w="full"
            borderColor="#FF7272"
            borderWidth="2px"
            borderRadius="7px"
            py="0.875rem"
            px="1.25rem"
          >
            <Flex
              fontFamily="body"
              justify="space-between"
              alignItems="center"
              w="full"
            >
              <Text fontWeight={600} fontFamily="heading" fontSize="0.9rem">
                Short
              </Text>
              <Flex gap="0.75rem" flexDir="column" justifyContent="flex-end">
                <Select
                  fontWeight={600}
                  fontSize="1.01rem"
                  w="fit-content"
                  ml="auto"
                  mr={0}
                  variant="unstyled"
                  placeholder={"0.07 BTC"}
                >
                  <option value="1 eth">0.07 BTC</option>
                </Select>
                <Flex ml="auto" mr={0} fontSize="0.875rem">
                  <Text mr={2} fontWeight={300}>
                    current price:
                  </Text>
                  <Text fontWeight={600}>$1600</Text>
                </Flex>
              </Flex>
            </Flex>
          </Box>
          <Box
            bg="#171717"
            w="full"
            borderColor="rgba(255, 255, 255, 0.2)"
            borderWidth="2px"
            borderRadius="7px"
            py="0.875rem"
            px="1.25rem"
          >
            <Flex
              fontFamily="body"
              justify="space-between"
              alignItems="center"
              w="full"
            >
              <Text fontWeight={600} fontFamily="heading" fontSize="0.9rem">
                Amount
              </Text>
              <Flex gap="0.75rem" flexDir="column" justifyContent="flex-end">
                <Text
                  fontWeight={600}
                  fontSize="1.01rem"
                  >
1200 USDC
                </Text>
                
              </Flex>
            </Flex>
          </Box>
         </VStack>
        </GridItem>

        <GridItem
          w="full"
          borderRadius={"0.5rem"}
          background="#1E1E1E"
          rowSpan={1}
          colSpan={2}
        ></GridItem>
        <GridItem
          w="full"
          borderRadius={"0.5rem"}
          background="#1E1E1E"
          rowSpan={1}
          colSpan={2}
        ></GridItem>
      </Grid>
    </>
  );
};

export default Trade;
