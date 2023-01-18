import {
  Box,
  Button,
  Flex,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";

const ShortLongComp = () => {
  const labelStyles = {
    mt: "3",
    ml: "-1.5",
    fontSize: "sm",
    fontStyle: "body",
  };
  return (
    <>
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
      <VStack gap="0.825rem">
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
                <Text fontWeight={600}>$16000</Text>
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
              <Text fontWeight={600} fontSize="1.01rem">
                1200 USDC
              </Text>
            </Flex>
          </Flex>
        </Box>
        <Flex
          w="full"
          fontWeight={600}
          fontSize="1.01rem"
          fontFamily="body"
          gap={3}
        >
          <Text>Leverage</Text>
          <Text
            px={3}
            py={1}
            fontWeight={500}
            fontSize="0.9rem"
            bg="#2F2F2F"
            borderRadius="7px"
          >
            2x
          </Text>
        </Flex>
        <Slider
          min={0}
          max={2}
          step={1}
          aria-label="slider-ex-2"
          colorScheme="#3F3F3F"
          defaultValue={1}
        >
          <SliderMark value={0} {...labelStyles}>
            0x
          </SliderMark>
          <SliderMark value={1} {...labelStyles}>
            1x
          </SliderMark>
          <SliderMark value={2} {...labelStyles}>
            2x
          </SliderMark>
          <SliderTrack borderRadius="1rem" h="20px">
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6} />
        </Slider>

        <VStack pt={4} w="full" gap={3}>
          <Flex w='full'
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Leverage</Text>
            <Text>2x</Text>
          </Flex>
          <Flex w='full'
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Entity Prise</Text>
            <Text>$2000</Text>
          </Flex>
          <Flex w='full'
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Liquidation Price</Text>
            <Text>$2000</Text>
          </Flex>
          <Flex w='full'
            alignItems="center"
            justify="space-between"
            fontFamily="body"
            fontWeight={500}
            fontSize="0.9rem"
          >
            <Text>Fees</Text>
            <Text>0.02 ETH</Text>
          </Flex>
        </VStack>
        <Button bg='#FFFFFF' color='black' fontFamily='header' w='full' fontWeight={600} fontSize='1.25rem'>
          Open Position
        </Button>
      </VStack>
    </>
  );
};

export default ShortLongComp;
