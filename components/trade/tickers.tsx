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

export default function Tickers() {
  return (
    <Flex
      bg="#202020"
      p="1rem"
      direction="column"
      borderRadius="12px"
      w="100%"
      minH="50%"
      h="100%"
      border="1px solid rgba(255, 255, 255, 0.2)"
    >
      <TableContainer
        fontFamily="body"
        fontWeight={600}
        fontSize="0.875rem"
        w="100%"
      >
        <Table variant="simple">
          <Thead fontSize="1.1rem" fontFamily="body">
            <Tr>
              <Td>
                <Text variant="paragraph">Symbol</Text>
              </Td>
              <Td>
                {" "}
                <Text variant="paragraph">Last</Text>
              </Td>
              <Td>
                {" "}
                <Text variant="paragraph">Change (1D)</Text>
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr my={2} bg="#252525" borderRadius="7px">
              <Td>ETH / BTC</Td>
              <Td>0.0006</Td>
              <Td>10%</Td>
              {/* color={position.pnl.includes("-") ? "#FF7272" : "brand"}> */}
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}
