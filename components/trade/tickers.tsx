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

type TickerProps = {
  symbols: any,
  handleChange: any
}

export default function Tickers({ symbols, handleChange }: TickerProps) {

  return (
    <Flex
      bg="#202020"
      p="0.5rem"
      direction="row"
      borderRadius="12px"
      w="100%"
      minH="50%"
      h="50%"
    >
      <TableContainer
        fontFamily="body"
        fontWeight={600}
        fontSize="0.875rem"
      // overflowX="hidden"
      >
        <Table size='sm' variant="simple" >
          <Thead fontFamily="body">
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

            {symbols.map((symbol1: any, key: number) => (
              <Tr 
              key={key}
              // onClick={() => console.log(symbol1)}
              onClick={() => handleChange(symbol1.label)}
               my={2} bg="#252525" borderRadius="7px" 
               _hover={{ cursor: "pointer" }}>
                <Td fontSize="0.75rem">{symbol1.label}</Td>
                <Td fontSize="0.75rem">{symbol1.price}</Td>
                <Td fontSize="0.75rem">10%</Td></Tr>
            ))}

            {/* color={position.pnl.includes("-") ? "#FF7272" : "brand"}> */}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}
