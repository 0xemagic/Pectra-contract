import {
  Flex,
  Box,
  Text,
  Select,
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

import { useReadPrice } from "@/components/hooks/usePrices";

export default function Tickers() {

  const { data } = useReadPrice();

  console.log(data)

  return (
    <Flex
      bg="#202020"
      p="0.5rem"
      direction="column"
      borderRadius="12px"
      w="100%"
      minH="50%"
      h="50%"
    >
      <TableContainer
        fontFamily="body"
        fontWeight={600}
        fontSize="0.875rem"
        overflowX="hidden"
      >
        <Table size='sm' variant="simple" >
          <Thead  fontFamily="body">
            <Tr>
              <Td>
                <Text fontSize="0.75rem" variant="paragraph">Symbol</Text>
              </Td>
              <Td>
                {" "}
                <Text fontSize="0.75rem" variant="paragraph">Last</Text>
              </Td>
              <Td>
                {" "}
                <Text fontSize="0.75rem" variant="paragraph">Change (1D)</Text>
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr my={2} bg="#252525" borderRadius="7px">
              <Td fontSize="0.75rem">ETH / BTC</Td>
              <Td fontSize="0.75rem">0.0006</Td>
              <Td fontSize="0.75rem">10%</Td>
              {/* color={position.pnl.includes("-") ? "#FF7272" : "brand"}> */}
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}
