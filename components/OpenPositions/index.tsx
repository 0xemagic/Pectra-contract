import {
  Box,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import CircleIcon from "../CircleIcon";

const OpenPositions = () => {
  const marketPositions = [
    {
      market: "ETH",
      side: "Long",
      size: "2.123",
      leverage: "2x",
      stat1: "##",
      stat2: "##",
      stat3: "##",
    },
    {
      market: "ETH",
      side: "Short",
      size: "2.123",
      leverage: "2x",
      stat1: "##",
      stat2: "##",
      stat3: "##",
    },
    {
      market: "ETH",
      side: "Short",
      size: "2.123",
      leverage: "2x",
      stat1: "##",
      stat2: "##",
      stat3: "##",
    },
  ];
  return (
    <>
      <Text fontFamily="body" fontWeight={600} fontSize="1.1rem">
        Open Positions
      </Text>
      <TableContainer fontFamily="body" fontWeight={600} fontSize="0.875rem">
        <Table variant="simple">
          <Thead fontSize="1.1rem" fontFamily="body">
            <Tr>
              <Th>Market</Th>
              <Th>Side</Th>
              <Th isNumeric>Size</Th>
              <Th>Leverage</Th>
              <Th>Stat</Th>
              <Th>Stat</Th>
              <Th>Stat</Th>
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
                        ? '"rgba(172, 224, 117, 0.2)"'
                        : "#4D3030"
                    }
                    p={2}
                    borderRadius="7px"
                    w="fit-content"
                    color={position.side === "Long" ? "brand" : "#FF7272"}
                  >
                    {position.side}
                  </Box>
                </Td>
                <Td isNumeric>{position.size}</Td>
                <Td>{position.leverage}</Td>
                <Td>##</Td>
                <Td>##</Td>
                <Td>##</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OpenPositions;
