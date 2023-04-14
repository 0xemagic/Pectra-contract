import React from "react";

import {
  Box,
  Grid,
  HStack,
  Text,
  Link,
  useToast,
  useColorMode,
} from "@chakra-ui/react";

import { HiInformationCircle } from "react-icons/hi";
import { RiArrowRightUpLine } from "react-icons/ri";

type ButtonProps = {
  icon?: boolean;
  message?: string;
  link?: string;
};

export function WarningToast({ link, icon, message }: ButtonProps) {
  const { colorMode } = useColorMode();
  return (
    <Grid
      gridTemplateColumns="30px 1fr"
      justifyContent="left"
      p="16px"
      borderRadius="8px"
      height={{ base: "48px", md: "55px" }}
      width={{ base: "343px", md: "400px" }}
      bg="#391A03"
      alignItems="center"
    >
      <Box
        borderRadius="180px"
        bg={colorMode === "dark" ? "#FF802B" : "#FEFCFB"}
        h="8px"
        w="8px"
      />
      <Link href={`https://arbiscan.io/tx/${link}`} isExternal>
        <HStack w="full" justifyContent="space-between" alignItems="start">
          <Text
            textAlign="left"
            color="#EDEDED"
            fontSize={{ base: "0.875rem", md: "1.15rem" }}
            lineHeight="1rem"
            fontFamily="Inter"
          >
            {message}
          </Text>
          {icon ? <HiInformationCircle color="white" /> : null}
        </HStack>
      </Link>
    </Grid>
  );
}

export function DangerToast({ link, icon, message }: ButtonProps) {
  const { colorMode } = useColorMode();

  const toast = useToast();
  return (
    <Grid
      gridTemplateColumns="30px 1fr"
      justifyContent="left"
      p="16px"
      borderRadius="8px"
      height={{ base: "48px", md: "55px" }}
      width={{ base: "343px", md: "400px" }}
      bg={colorMode === "dark" ? "#391A03" : "#E5484D"}
      alignItems="center"
    >
      <Box
        borderRadius="180px"
        bg={colorMode === "dark" ? "#F2555A" : "#FEFCFB"}
        h="8px"
        w="8px"
      />
      <Link href={`https://arbiscan.io/tx/${link}`} isExternal>
        <HStack w="full" justifyContent="space-between" alignItems="start">
          <Text
            textAlign="left"
            color="#EDEDED"
            fontSize={{ base: "0.875rem", md: "1.15rem" }}
            lineHeight="1rem"
            fontFamily="Inter"
          >
            {message}
          </Text>
          {icon ? <RiArrowRightUpLine color="white" /> : null}
        </HStack>
      </Link>
    </Grid>
  );
}

export function SuccessToast({ link, icon, message }: ButtonProps) {
  const { colorMode } = useColorMode();

  const toast = useToast();
  return (
    <Grid
      gridTemplateColumns="30px 1fr"
      justifyContent="left"
      p="16px"
      borderRadius="8px"
      border={colorMode === "dark" ? "1px solid" : ""}
      borderColor="#133929"
      height={{ base: "48px", md: "55px" }}
      width={{ base: "343px", md: "400px" }}
      bg={colorMode === "dark" ? "#0F291E" : "#30A46C"}
      alignItems="center"
    >
      <Box
        borderRadius="180px"
        bg={colorMode === "dark" ? "#3CB179" : "#FEFCFB"}
        h="8px"
        w="8px"
      />
      <Link href={`https://arbiscan.io/tx/${link}`} isExternal>
        <HStack w="full" justifyContent="space-between" alignItems="start">
          <Text
            textAlign="left"
            color="#EDEDED"
            fontSize={{ base: "0.875rem", md: "1.15rem" }}
            lineHeight="1rem"
            fontFamily="Inter"
          >
            {message}
          </Text>
          {icon ? <RiArrowRightUpLine color="white" /> : null}
        </HStack>
      </Link>
    </Grid>
  );
}

export function InfoToast({ link, icon, message }: ButtonProps) {
  const { colorMode } = useColorMode();

  const toast = useToast();
  return (
    <Grid
      gridTemplateColumns="1fr"
      justifyContent="left"
      p="16px"
      borderRadius="8px"
      height={{ base: "48px", md: "55px" }}
      width={{ base: "343px", md: "400px" }}
      bg={colorMode === "dark" ? "#232323" : "#E8E8E8"}
      alignItems="center"
    >
      <Link href={`https://arbiscan.io/tx/${link}`} isExternal>
        <HStack w="full" justifyContent="space-between" alignItems="start">
          <Text
            textAlign="left"
            color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            fontSize={{ base: "0.875rem", md: "1.15rem" }}
            lineHeight="1rem"
            fontFamily="Inter"
          >
            {message}
          </Text>
          {icon ? (
            <RiArrowRightUpLine
              color={colorMode === "dark" ? "white" : "black"}
            />
          ) : null}
        </HStack>
      </Link>
    </Grid>
  );
}
