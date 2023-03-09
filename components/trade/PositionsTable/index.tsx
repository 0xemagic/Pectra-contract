import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Button,
  Thead,
  Tr,
} from "@chakra-ui/react";
import CircleIcon from "../../UI/CircleIcon";

const OpenPositions = ({tabIndex}: any) => {
  const marketPositions = [
    {
      collateral: "700",
      long: "ETH",
      short: "BTC",
      size: "1400",
      leverage: "2x",
      entry: "1,300",
      liquidation: "800",
      pnl: "-$200",
      netvalue: "$500",
    },
    {
      collateral: "200",
      long: "BTC",
      short: "ETH",
      size: "400",
      leverage: "2x",
      entry: "1,600",
      liquidation: "1,800",
      pnl: "+$200",
      netvalue: "$500",
    },
    {
      collateral: "1,500",
      long: "ETH",
      short: "BTC",
      size: "3,000",
      leverage: "2x",
      entry: "1,200",
      liquidation: "1,700",
      pnl: "-$200",
      netvalue: "$500"
    },
  ];

  return (
    <Flex
      bg="#202020"
      p="1.75rem"
      direction="column"
      borderRadius="12px"
      w="100%"
      // border="1px solid rgba(255, 255, 255, 0.2)"
    >
      <Text fontFamily="body" fontWeight={600} fontSize="1.1rem">
        Open Positions
      </Text>
      <TableContainer
        fontFamily="body"
        fontWeight={600}
        fontSize="0.875rem"
        w="100%"
      >
        <Table variant="simple" size={tabIndex === 0 ? "sm" : "md"}>
          <Thead fontSize="1.1rem" fontFamily="body">
            <Tr>
              <Td>
                <Text variant="paragraph">Collateral</Text>
              </Td>
              <Td>
                {" "}
                <Text variant="paragraph">Tokens</Text>
              </Td>
              <Td>
                {" "}
                <Text variant="paragraph">Entry Size</Text>
              </Td>
              <Td>
                {" "}
                <Text variant="paragraph">Leverage</Text>
              </Td>
              <Td>
                {" "}
                <Text variant="paragraph">Entry Price</Text>
              </Td>
              <Td>
                {" "}
                <Text variant="paragraph">Current Price</Text>
              </Td>
              <Td>
                {" "}
                <Text variant="paragraph">PnL</Text>
              </Td>
              <Td>
                {" "}
                <Text variant="paragraph">Net Value</Text>
              </Td>
              <Td><Text variant="paragraph">Actions</Text></Td>
            </Tr>
          </Thead>
          <Tbody>
            {marketPositions.map((position, key) => (
              <Tr key={key} my={2} bg="#252525" borderRadius="7px">
                <Td>{position.collateral} USDC</Td>
                <Td>
                  <Flex>
                    <Box
                      bg="rgba(172, 224, 117, 0.2)"
                      px={2}
                      py={1}
                      borderLeftRadius="7px"
                      w="fit-content"
                      color="brand"
                    >
                      {position.long}
                    </Box>
                    <Box
                      bg="#4D3030"
                      px={2}
                      py={1}
                      borderRightRadius="7px"
                      w="fit-content"
                      color="#FF7272"
                    >
                      {position.short}
                    </Box>
                  </Flex>
                </Td>
                <Td>{position.size}</Td>
                <Td>{position.leverage}</Td>
                <Td>{position.entry}</Td>
                <Td>{position.liquidation}</Td>
                <Td color={position.pnl.includes("-") ? "#FF7272" : "brand"}>{position.pnl}</Td>
                <Td>{position.netvalue}</Td>
                <Td>
                  <Flex align="center" gap="0.5rem">
                    <Button variant="tertiary" width="5rem" height="1.5rem" fontSize="1rem"
                           borderColor="#B8B8B8"
                           borderWidth="1px"
                    >
                      Close
                    </Button>
                    <Button variant="function">Share</Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default OpenPositions;
