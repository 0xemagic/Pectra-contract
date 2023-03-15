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

type TickerProps = {
  symbols: any;
  handleChange: any;
};

export default function Tickers({ symbols, handleChange }: TickerProps) {
  return (
    <Flex
      bg="#202020"
      p="0.5rem"
      direction="row"
      borderRadius="12px"
      w="100%"
      minH="50%"
      h="inherit"
    >
      <TableContainer
        fontFamily="body"
        fontWeight={600}
        fontSize="0.875rem"
        w={"full"}
        // overflowX="hidden"
      >
        <Table m="auto" size={{ base: "sm", "2xl": "md" }} variant="simple">
          <Thead fontFamily="body">
            <Tr>
              <Td>
                <Text fontSize="0.75rem" variant="paragraph">
                  Symbol
                </Text>
              </Td>
              <Td>
                {" "}
                <Text fontSize="0.75rem" variant="paragraph">
                  Last
                </Text>
              </Td>
              <Td>
                {" "}
                <Text fontSize="0.75rem" variant="paragraph">
                  Change (1D)
                </Text>
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            {symbols.map((symbol1: any, key: number) => {
              let change = key % 2 === 0 ? 1 : -1;
              const color = change >= 0 ? "green" : "red";
              console.log("symbol1", symbol1);
              return (
                <Tr
                  m="auto"
                  key={key}
                  // onClick={() => console.log(symbol1)}
                  onClick={() => handleChange(symbol1.label)}
                  my={2}
                  bg="#252525"
                  borderRadius="7px"
                  _hover={{ cursor: "pointer", bgColor: "gray" }}
                >
                  <Td fontSize="0.75rem">{symbol1.label}</Td>
                  <Td fontSize="0.75rem">{symbol1.price}</Td>
                  <Td className="change" color={color} fontSize="0.75rem">
                    10%
                  </Td>
                </Tr>
              );
            })}

            {/* color={position.pnl.includes("-") ? "#FF7272" : "brand"}> */}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}
