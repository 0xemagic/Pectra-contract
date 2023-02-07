import PositionComp from "@/components/trade";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";

const CloseComp = () => {
  const onClosePosition = () => {
    
  }

  return (
    <>
      <Box mb="1.56rem" fontFamily={"body"} fontWeight={600} fontSize="1.06rem">
        Close a Position
      </Box>

      <PositionComp
        position="LONG"
        asset="ETH"
        assetAmount="10X"
        dateOpened="1/11/23"
        data={["+2220", "USDC"]}
      />

      <Button mt="2.5rem" variant="tertiary">
        Close
      </Button>
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
