import { Box, Flex, Text, Tooltip, useColorMode } from "@chakra-ui/react";
import { commify } from "ethers/lib/utils.js";
import millify from "millify";
import { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

import { BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useBuyTokens } from "../hooks/usePublicSale";
import { truncate } from "../utils";

type ProgressBarProps = {
  percentage: number;
  borderColor?: string;
  label: string;
  translateX?: number;
  bottomBox?: string;
  bottomLabel?: string;
};

export default function TotalInvestedBar() {
  const { colorMode } = useColorMode();

  const [privateLabel, setPrivateLabel] = useState(false);
  const [publicLabel, setPublicLabel] = useState(false);
  const [availableLabel, setAvailableLabel] = useState(false);

  const [startLabel, setStartLabel] = useState(false);
  const [endLabel, setEndLabel] = useState(false);
  const [alreadySoldLabel, setAlreadySoldLabel] = useState(false);

  const legend = [
    {
      name: "Public",
      description: "How much has been sold through public sale",
      color: "#81FF7E",
    },
    {
      name: "Unsold",
      description: "How much is available for public sale",
      color: "white",
    },
  ];

  const { tokensSold } = useBuyTokens();
  //   const tokensSold = 0;

  const spectraSold = tokensSold
    ? +formatUnits(tokensSold as BigNumberish, 18)
    : 0;
  const spectraUnsold = 100_000_000 - spectraSold;

  const ProgressBarMark = ({
    percentage,
    label,
    borderColor = "#43931E",
    translateX = 0,
    bottomLabel = "-2.75rem",
    bottomBox = "-0.75rem",
  }: ProgressBarProps) => {
    return (
      <Box position="absolute" left={`${percentage}%`} top="0">
        <Box
          height="0.5rem"
          width="4px"
          bg={borderColor}
          transform={`translateX(-50%) translateY(${bottomBox}) translateX(${translateX}px)`}
        />
        {translateX !== 0 ? (
          <Tooltip
            label={`${millify(spectraSold)} of public sales`}
            isOpen={alreadySoldLabel}
          >
            <Flex
              alignItems="center"
              justifyContent="center"
              transform={`translateX(-50%) translateY(${bottomLabel}) translateX(${translateX}px)`}
              onMouseEnter={() => setAlreadySoldLabel(true)}
              onMouseLeave={() => setAlreadySoldLabel(false)}
              onClick={() => setAlreadySoldLabel(true)}
            >
              <Text
                variant="paragraph"
                fontWeight="bold"
                color={borderColor}
                textAlign="center"
                mr="0.15rem"
              >
                {label}
              </Text>
              <AiOutlineInfoCircle color="red" />
            </Flex>
          </Tooltip>
        ) : (
          <Text
            variant="paragraph"
            fontWeight="bold"
            color={borderColor}
            textAlign="center"
            transform={`translateX(-50%) translateY(-2.75rem) translateX(${translateX}px)`}
          >
            {label}
          </Text>
        )}
      </Box>
    );
  };

  return (
    <Flex direction="column">
      <Flex
        alignSelf="center"
        alignItems="center"
        justifyContent="center"
        justifyItems="center"
        w="full"
      >
        <Tooltip label="Start of private sale" isOpen={startLabel}>
          <Flex
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            justifyContent="center"
            mt="1.75rem"
            mr="0.5rem"
            color="#43931E"
            onMouseEnter={() => setStartLabel(true)}
            onMouseLeave={() => setStartLabel(false)}
            onClick={() => setStartLabel(true)}
          >
            <Text
              variant="paragraph"
              mr="0.15rem"
              fontWeight="bold"
              textAlign="center"
              color="#43931E"
            >
              0M
            </Text>
            <AiOutlineInfoCircle />
          </Flex>
        </Tooltip>
        <Flex
          alignSelf="center"
          direction="row"
          mt="2rem"
          w="90%"
          border="4px solid"
          borderColor="#43931E"
          borderRadius="xl"
          position="relative"
        >
          <ProgressBarMark percentage={100 * (625000 / 2500000)} label="625K" />
          <ProgressBarMark
            percentage={100 * (1250000 / 2500000)}
            label="1.25M"
          />
          <ProgressBarMark
            percentage={100 * (1875000 / 2500000)}
            label="1.875M"
          />
          {+spectraSold > 0 && (
            <Flex
              bg={legend[0].color}
              w={`${Math.max((spectraSold / 100_000_000) * 100, 10)}%`}
              h={{ base: "3rem", md: "2.5rem" }}
              direction="column"
              justify="center"
              align="center"
              px={{ base: "2rem", md: "1rem" }}
              borderLeftRadius={"lg"}
            >
              <Tooltip
                label={`$PECTRA Sold: ${commify(spectraSold)}`}
                isOpen={publicLabel}
              >
                <Flex
                  direction={{ base: "column", "2xl": "row" }}
                  onMouseEnter={() => setPublicLabel(true)}
                  onMouseLeave={() => setPublicLabel(false)}
                  onClick={() => setPublicLabel(true)}
                  alignContent="center"
                >
                  <Text
                    color="#222222"
                    textAlign="center"
                    fontSize={{ base: "0.75rem", md: "1rem" }}
                    fontWeight="bold"
                    mr={{ base: "0rem", md: "0.5rem" }}
                  >{`${((spectraSold / 100_000_000) * 100).toFixed(1)}%`}</Text>
                  <Text
                    color="#222222"
                    fontSize={{ base: "0.75rem", md: "1rem" }}
                  >{`($${millify(spectraSold / 40)})`}</Text>
                </Flex>
              </Tooltip>
            </Flex>
          )}
          <Flex
            w={`${Math.min((spectraUnsold / 100_000_000) * 100, 90)}%`}
            h={{ base: "3rem", md: "2.5rem" }}
            bg={legend[1].color}
            borderWidth={"1px"}
            borderRightRadius={"lg"}
            borderLeftRadius={+spectraSold > 0 ? "0" : "lg"}
            direction="column"
            justify="center"
            align="center"
          >
            {
              <Tooltip
                label={`$PECTRA Available:  ${truncate(commify(spectraUnsold), 2)}`}
                isOpen={availableLabel}
              >
                <Flex
                  direction={{ base: "column", md: "row" }}
                  onMouseEnter={() => setAvailableLabel(true)}
                  onMouseLeave={() => setAvailableLabel(false)}
                  onClick={() => setAvailableLabel(true)}
                >
                  <Text
                    color={colorMode === "dark" ? "black" : "black"}
                    fontWeight="bold"
                    textAlign="center"
                    fontSize={{ base: "0.75rem", md: "1rem" }}
                  >{`${((spectraUnsold / 100_000_000) * 100).toFixed(1)}%`}</Text>
                  <Text
                    color={colorMode === "dark" ? "black" : "black"}
                    textAlign="center"
                    fontSize={{ base: "0.75rem", md: "1rem" }}
                  >{`($${commify(spectraUnsold / 40)})`}</Text>
                </Flex>
              </Tooltip>
            }
          </Flex>
        </Flex>
        <Tooltip label="End of public sale" isOpen={endLabel}>
          <Flex
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            justifyContent="center"
            mt="1.75rem"
            ml="0.5rem"
            color="#43931E"
            onMouseEnter={() => setEndLabel(true)}
            onMouseLeave={() => setEndLabel(false)}
            onClick={() => setEndLabel(true)}
          >
            <Text
              variant="paragraph"
              mr="0.15rem"
              fontWeight="bold"
              textAlign="center"
              color="#43931E"
            >
              2.5M
            </Text>
            <AiOutlineInfoCircle />
          </Flex>
        </Tooltip>
      </Flex>

      {/* <Flex
                pb={{ base: "0rem", md: "1rem" }}
                justifyContent="space-between"
                alignSelf={{ base: "center", md: "start" }}
                px={{ base: "1rem", md: "4rem" }}>
                {legend.map((item, i) => (
                    <Flex
                        direction="row"
                        mr="24px"
                        mt="0.5rem"
                        textAlign="start"
                        display="inline-block"
                        key={i}>
                        <HStack spacing="8px">
                            <Box
                                display="inline-block"
                                borderRadius="4px"
                                w="16px"
                                h="16px"
                                fontSize="25px"
                                verticalAlign="middle"
                                bgColor={item.color}
                                border="1px solid black"
                            >
                                {" "}
                            </Box>{" "}
                            <Text
                                textAlign="start"
                                w="full"
                                fontSize={{ base: "xs", md: "md" }}
                            >
                                {item.name}
                            </Text>
                        </HStack>
                    </Flex>
                ))}
            </Flex> */}
    </Flex>
  );
}
