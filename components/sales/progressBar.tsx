import {
    Box,
    HStack,
    Flex,
    Skeleton,
    Text,
    Tooltip,
    useColorMode,
} from "@chakra-ui/react";
import { commify } from "ethers/lib/utils.js";
import millify from "millify";
import { truncate } from "../utils";
import { useState } from "react";
import { AiOutlineInfoCircle } from 'react-icons/ai'

type ProgressBarProps = {
    percentage: number;
    borderColor?: string;
    label: string;
    translateX?: number;
}


export default function TotalInvestedBar() {
    const { colorMode } = useColorMode();

    const [privateLabel, setPrivateLabel] = useState(false);
    const [publicLabel, setPublicLabel] = useState(false);
    const [availableLabel, setAvailableLabel] = useState(false);

    const [startLabel, setStartLabel] = useState(false);
    const [endLabel, setEndLabel] = useState(false);
    const [alreadySoldLabel, setAlreadySoldLabel] = useState(false);

    const legend = [
        { name: "Private", color: "#BBFF81" },
        { name: "Public", color: "#81FF7E" },
        { name: "Unsold", color: "white" },
        { name: "Current", color: "red" }
    ];

    const privateAmount = 1000000;
    const publicAmount = 100000;
    const available = 2500000 - (publicAmount + privateAmount);

    const ProgressBarMark = ({ percentage, label, borderColor="#43931E", translateX = 0 }: ProgressBarProps) => {
        return (
            <Box position="absolute" left={`${percentage}%`} top="0">
                <Box
                    height="1rem"
                    width="4px"
                    bg={borderColor}
                    transform={`translateX(-50%) translateY(-1.25rem) translateX(${translateX}px)`}
                />
                {translateX !== 0 ?
                    (
                        <Tooltip
                            label={`${millify(privateAmount)} raised through private sale + ${millify(publicAmount)} of public sales`}
                            isOpen={alreadySoldLabel}
                        >
                            <Flex
                                alignItems="center"
                                justifyContent="center"
                                transform={`translateX(-50%) translateY(-3.75rem) translateX(${translateX}px)`}
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
                    )
                    :
                    <Text
                        variant="paragraph"
                        fontWeight="bold"
                        color={borderColor}
                        textAlign="center"
                        transform={`translateX(-50%) translateY(-3.75rem) translateX(${translateX}px)`}
                    >
                        {label}
                    </Text>
                }

            </Box>
        );
    };

    return (
        <Flex
            direction="column"
        >
            <Flex alignItems="center">
                <Tooltip
                    label="Start of private sale"
                    isOpen={startLabel}
                >
                    <Flex
                        alignItems="center"
                        justifyContent="center"
                        mt="1.75rem"
                        mr="0.5rem"
                        color="#43931E"
                        onMouseEnter={() => setStartLabel(true)}
                        onMouseLeave={() => setStartLabel(false)}
                        onClick={() => setStartLabel(true)}
                    >
                        <Text variant="paragraph" mr="0.15rem"
                            fontWeight="bold"
                            textAlign="center"
                            color="#43931E"
                        >0M</Text>
                        <AiOutlineInfoCircle />
                    </Flex>
                </Tooltip>
                <Flex
                    alignSelf="center"
                    direction="row"
                    mt="2rem" w="90%"
                    border="4px solid"
                    borderColor="#43931E"
                    borderRadius="xl"
                    position="relative"
                >
                    <ProgressBarMark
                        percentage={((publicAmount + privateAmount) / 2500000) * 100}
                        label={`${millify(publicAmount + privateAmount)}`}
                        borderColor="red"
                        translateX={-2}
                    />
                    <ProgressBarMark
                        percentage={25}
                        label="625K"
                    />
                    <ProgressBarMark
                        percentage={50}
                        label="1.25M"
                    />
                    <ProgressBarMark
                        percentage={75}
                        label="1.875M"
                    />
                    <ProgressBarMark
                        percentage={100 * (1000000 / 2500000)}
                        label="1M"
                    />
                    <Flex
                        bg={legend[0].color}
                        w={`${(privateAmount / 1000000) * 90}%`}
                        h="3rem"
                        placeContent="center"
                        justifyItems="center"
                        borderLeftRadius={"lg"}
                    >
                        <Tooltip
                            label={`Private Token Sale ${commify(
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
                        bg={legend[1].color}
                        w={`${(publicAmount / 1000000) * 90}%`}
                        h="3rem"
                        placeContent="center"
                    >
                        <Tooltip
                            label={`Public Token Sale: ${commify(
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
                        bg={legend[2].color}
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
                </Flex>
                <Tooltip
                    label="End of public sale"
                    isOpen={endLabel}
                >
                    <Flex
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
                        >2.5M</Text>
                        <AiOutlineInfoCircle />
                    </Flex>
                </Tooltip>
            </Flex>
            <Flex mt="1rem" justifyContent="space-between" alignSelf="center" w={{ base: "80%", lg: "50%" }}>
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
            </Flex>
        </Flex>
    );
};