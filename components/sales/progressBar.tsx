import {
    Box,
    HStack,
    Flex,
    Skeleton,
    Text,
    Tooltip,
    useColorMode,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { commify } from "ethers/lib/utils.js";
import millify from "millify";
import { truncate } from "../utils";
import { useContractReads } from "wagmi";
import { useState } from "react";

export default function TotalInvestedBar() {
    const { colorMode } = useColorMode();

    const [privateLabel, setPrivateLabel] = useState(false);
    const [publicLabel, setPublicLabel] = useState(false);
    const [availableLabel, setAvailableLabel] = useState(false);

    const legend = [
        { name: "Private", color: "#BBFF81" },
        { name: "Available", color: "white" },
        { name: "Public", color: "#81FF7E" },
    ];

    const privateAmount = 1000000;
    const available = 1400000;
    const publicAmount = 100000;

    return (
        <Flex 
            alignItems="center" 
            direction="row" 
            my="2rem" w="100%"
            border="4px solid"
            borderColor="#43931E"
            borderRadius="xl"
        >
            <Flex
                bg={legend[0].color}
                w={`${(privateAmount / 1000000) * 100}%`}
                h="3rem"
                placeContent="center"
                justifyItems="center"
                borderLeftRadius={"lg"}
            >
                <Tooltip
                    label={`Private Token Sales ${commify(
                        privateAmount
                    )} (${truncate(commify(privateAmount), 2)} USDC)`}
                    isOpen={privateLabel}
                >
                    <Flex
                        direction="column"
                        onMouseEnter={() => setPrivateLabel(true)}
                        onMouseLeave={() => setPrivateLabel(false)}
                        onClick={() => setPrivateLabel(true)}
                    >
                        <Text color="#222222" textAlign="center" fontWeight="bold" size="xs">{`${(
                            (privateAmount / 2500000) *
                            100
                        ).toFixed(1)}%`}</Text>
                        <Text color="#222222" size="xs">{`$${millify(privateAmount)}`}</Text>
                    </Flex>
                </Tooltip>
            </Flex>
            <Flex
                bg={legend[2].color}
                w={`${(publicAmount / 1000000) * 100}%`}
                h="3rem"
                placeContent="center"
                borderWidth={"1px"}
            >
                <Tooltip
                    label={`Public Token Sales: ${commify(
                        publicAmount
                    )} (${truncate(commify(publicAmount), 2)} USDC)`}
                    isOpen={publicLabel}
                >
                    <Flex
                        direction="column"
                        onMouseEnter={() => setPublicLabel(true)}
                        onMouseLeave={() => setPublicLabel(false)}
                        onClick={() => setPublicLabel(true)}
                    >
                        <Text color="#222222" textAlign="center" size="xs" fontWeight="bold">{`${(
                            (publicAmount / 2500000) *
                            100
                        ).toFixed(1)}%`}</Text>
                        <Text color="#222222" size="xs">{`$${millify(publicAmount)}`}</Text>
                    </Flex>
                </Tooltip>
            </Flex>
            <Flex
                w={`${(available / 1000000) * 90}%`}
                maxH="3rem"
                placeContent="center"
                direction="column"
                bg={legend[1].color}
                borderWidth={"1px"}
                borderRightRadius={"lg"}
            >
                <Tooltip
                    label={`Available token amount: ${commify(available)} (${truncate(
                        commify(available),
                        2
                    )} USDC)`}
                    isOpen={availableLabel}
                >
                    <Flex
                        direction="column"
                        onMouseEnter={() => setAvailableLabel(true)}
                        onMouseLeave={() => setAvailableLabel(false)}
                        onClick={() => setAvailableLabel(true)}
                    >
                        <Text
                            color={colorMode === "dark" ? "black" : "black"}
                            textAlign="center"
                            fontWeight="bold"
                            size="xs"
                        >{`${((available / 2500000) * 100).toFixed(1)}%`}</Text>
                        <Text
                            color={colorMode === "dark" ? "black" : "black"}
                            textAlign="center"
                            size="xs"
                        >{`$${millify(available)}`}</Text>
                    </Flex>
                </Tooltip>
            </Flex>
            {/* <Flex my="1rem" justifyContent="space-between">
          {legend.map((item, i) => (
            <Box mr="24px" textAlign="center" display="inline-block" key={i}>
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
                  textAlign="center"
                >
                  {item.name}
                </Text>
              </HStack>
            </Box>
          ))}
        </Flex> */}
        </Flex>
    );
};