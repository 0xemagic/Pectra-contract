import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";

const CloseComp = () => {
  return (
    <>
      <Box mb='1.56rem' fontFamily={"body"} fontWeight={600} fontSize="1.06rem">
        Redeem peETH/BTC
      </Box>
      <Box
        p="1.625rem"
        bg="linear-gradient(263.59deg, #82B14F 0.01%, #42804C 94.79%)"
        boxShadow="0px 4px 12px #518128"
        borderRadius="1.25rem"
        w="full"
      >
        <Flex justify="space-between" alignItems="flex-start" w="full">
          <VStack
            alignItems="end"
            fontStyle={"heading"}
            textAlign="right"
            py="1.01rem"
            px="1.18rem"
            bg="transparent"
            border="1px solid rgba(255, 255, 255, 0.2)"
            borderRadius="0.825rem"
            w="fit-content"
          >
            <Text fontWeight={500} fontSize="1.25rem">
              +2220
            </Text>
            <Text fontWeight={400} fontSize="0.825rem">
              USDC
            </Text>
          </VStack>
          <VStack
            gap="0.5rem"
            alignItems="end"
            fontWeight={500}
            fontStyle="heading"
          >
            <Text color="#A4EF6A">LONG</Text>
            <Text color="white">ETH 10X</Text>
          </VStack>
        </Flex>
        <Text textAlign="right" fontWeight={500} fontSize="0.75rem">
          OPENED 1/11/23
        </Text>
      </Box>
      <Button mt='2.5rem' variant="tertiary">Close</Button>
      <VStack pt={4} w="full" gap={3}>
        <Flex
          w="full"
          alignItems="center"
          justify="space-between"
          fontFamily="body"
          fontWeight={500}
          fontSize="0.9rem"
        >
          <Text>Total USDC</Text>
          <Text>2220</Text>
        </Flex>
        <Flex
          w="full"
          alignItems="center"
          justify="space-between"
          fontFamily="body"
          fontWeight={500}
          fontSize="0.9rem"
        >
          <Text>Net</Text>
          <Text>
            <span color="#ACE075">(+45%)</span> 1212
          </Text>
        </Flex>
        <Flex
          w="full"
          alignItems="center"
          justify="space-between"
          fontFamily="body"
          fontWeight={500}
          fontSize="0.9rem"
        >
          <Text>Liquidation Price</Text>
          <Text>$2000</Text>
        </Flex>
        <Flex
          w="full"
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
    </>
  );
};

export default CloseComp;
