import { Box, Flex, Spacer, Text, VStack } from "@chakra-ui/react";
import React from "react";

export interface PositionCompProps {
  position: "LONG" | "SHORT";
  asset: string;
  assetAmount: string;
  dateOpened: string;
  data?: string[];
}

const PositionComp: React.FC<PositionCompProps> = ({
  position,
  asset,
  assetAmount,
  dateOpened,
  data,
}) => {
  return (
    <Box
      p="1.625rem"
      bg={
        position === "LONG"
          ? "linear-gradient(263.59deg, #82B14F 0.01%, #42804C 94.79%)"
          : "linear-gradient(263.59deg, #B14F4F 0.01%, #804242 94.79%)"
      }
      borderRadius="1.25rem"
      w="full"
      h="full"
    >
      <Flex justify="space-between" alignItems="flex-start" w="full">
        {data && (
          <VStack
            alignItems="end"
            fontStyle={"heading"}
            textAlign="right"
            py={position === "LONG" ? "1.01rem" : "0rem"}
            px={position === "LONG" ? "1.18rem" : "0rem"}
            bg="transparent"
            border={
              position === "LONG" ? "1px solid rgba(255, 255, 255, 0.2)" : "0px"
            }
            borderRadius="0.825rem"
            w="fit-content"
          >
            {data.map((item, index) => (
              <Text
                key={index}
                fontWeight={500}
                fontSize={
                  position === "LONG" && index === 0 ? "1.25rem" : "0.75rem"
                }
              >
                {item}
              </Text>
            ))}
          </VStack>
        )}
        <Spacer />
        <VStack
          gap="0.5rem"
          alignItems="end"
          fontWeight={500}
          fontStyle="heading"
        >
          <Text color={position === "LONG" ? "#A4EF6A" : "#FF7272"}>
            {position}
          </Text>
          <Text color="white">
            {asset} {assetAmount}
          </Text>
        </VStack>
      </Flex>
      <Text
        color={position === "LONG" ? "#DAFFB2" : "#FFB1B1"}
        textAlign="right"
        fontWeight={500}
        fontSize="0.75rem"
      >
        OPENED {dateOpened}
      </Text>
    </Box>
  );
};

export default PositionComp;
