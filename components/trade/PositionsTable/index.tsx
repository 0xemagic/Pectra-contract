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
      collateral: "ETH",
      tokens: "ETH / BTC",
      entrysize: "2.123",
      leverage: "2x",
      entryprice: "1,300",
      currentprice: "800",
      pnl: "700",
      netvalue: "2400"
    },
    {
      collateral: "ETH",
      tokens: "ETH / BTC",
      entrysize: "2.123",
      leverage: "2x",
      entryprice: "1,300",
      currentprice: "800",
      pnl: "700",
      netvalue: "2400"
    },
    {
      collateral: "ETH",
      tokens: "ETH / BTC",
      entrysize: "2.123",
      leverage: "2x",
      entryprice: "1,300",
      currentprice: "800",
      pnl: "700",
      netvalue: "2400"
    },
  ];

  const TokensBox = ({ tokens, children }: { tokens: string, children: any }) => (
<Box
                    px={2}
                    py={1}
                    borderRadius="7px"
                    w="fit-content"
                  >{children}</Box>
  )

  return (
    <Flex bg="#202020" p="1.75rem" direction="column" borderRadius="12px">
      <Text fontFamily="body" fontWeight={600} fontSize="1.1rem">
        Open Positions
      </Text>
      <TableContainer fontFamily="body" fontWeight={600} fontSize="0.875rem">
        <Table variant="simple">
          <Thead fontSize="1.1rem" fontFamily="body">
            <Tr>
              <Th>Collateral</Th>
              <Th>Tokens</Th>
              <Th >Entry Size</Th>
              <Th>Leverage</Th>
              <Th>Entry Price</Th>
              <Th>Current Price</Th>
              <Th>PnL</Th>
              <Th>Net Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {marketPositions.map((position, key) => (
              <Tr key={key} my={2} bg="#252525" borderRadius="7px">
                <Td>
                  <Flex alignItems="center" gap={2}>
                    <CircleIcon />
                    {position.collateral}
                  </Flex>
                </Td>
                <Td>
                  
                    {position.tokens}
                </Td>
                <Td>{position.entrysize}</Td>
                <Td>{position.leverage}</Td>
                <Td>{position.entryprice}</Td>
                <Td>{position.currentprice}</Td>
                <Td>{position.pnl}</Td>
                <Td>{position.netvalue}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default OpenPositions;
