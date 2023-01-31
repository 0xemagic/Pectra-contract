import {
  Box,
  Flex,
  Table, TableContainer,
  Tbody,
  Td,
  Text, Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import CircleIcon from "../../UI/CircleIcon";

const OpenPositions = () => {
  const marketPositions = [
    {
      market: "ETH",
      side: "Long",
      size: "2.123",
      leverage: "2x",
      entry: "1,300",
      liquidation: "800",
      collateral: "700",
    },
    {
      market: "ETH",
      side: "Short",
      size: "2.123",
      leverage: "2x",
      entry: "1,600",
      liquidation: "1,800",
      collateral: "200",
    },
    {
      market: "ETH",
      side: "Short",
      size: "2.123",
      leverage: "2x",
      entry: "1,200",
      liquidation: "1,700",
      collateral: "1,500",
    },
  ];
  return (
    <Flex bg="#202020" p="1.75rem" direction="column" borderRadius="12px">
      <Text fontFamily="body" fontWeight={600} fontSize="1.1rem">
        Open Positions
      </Text>
      <TableContainer fontFamily="body" fontWeight={600} fontSize="0.875rem">
        <Table variant="simple">
          <Thead fontSize="1.1rem" fontFamily="body">
            <Tr>
              <Th>Market</Th>
              <Th>Side</Th>
              <Th >Size</Th>
              <Th>Leverage</Th>
              <Th>Entry Price</Th>
              <Th>Liq. Price</Th>
              <Th>Collateral</Th>
            </Tr>
          </Thead>
          <Tbody>
            {marketPositions.map((position, key) => (
              <Tr key={key} my={2} bg="#252525" borderRadius="7px">
                <Td>
                  <Flex alignItems="center" gap={2}>
                    <CircleIcon />
                    {position.market}
                  </Flex>
                </Td>
                <Td>
                  <Box
                    bg={
                      position.side === "Long"
                        ? "rgba(172, 224, 117, 0.2)"
                        : "#4D3030"
                    }
                    px={2}
                    py={1}
                    borderRadius="7px"
                    w="fit-content"
                    color={position.side === "Long" ? "brand" : "#FF7272"}
                  >
                    {position.side}
                  </Box>
                </Td>
                <Td>{position.size}</Td>
                <Td>{position.leverage}</Td>
                <Td>{position.entry}</Td>
                <Td>{position.liquidation}</Td>
                <Td>{position.collateral}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default OpenPositions;
