import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Links from "./Links";
import SecondComp from "./SecondComp";
import Stats from "./Stats";

const LandingPage = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  return (
    <>
      <Stack
        gap={{ base: "5.625rem", md: "11.5rem" }}
        minH="80vh"
        maxW={"100vw"}
        overflowX={"hidden"}
        justify="left"
        px={{ base: "2rem", md: "4rem" }}
      >
        <Flex direction="column" mt="6rem" w="full">
          {" "}
          <Heading fontSize={{ base: "2.75rem", md: "6rem" }} variant="hero">
            TRADE PAIRS
          </Heading>
          <Heading
            color="#ACE075"
            fontSize={{ base: "3rem", md: "6rem" }}
            variant="colored"
            mt="-0.5rem"
          >
            WITH PECTRA
          </Heading>
          <Text
            variant="paragraph"
            textAlign={"start"}
            mt={{ base: "2.5rem", md: "2rem" }}
            w={{ base: "350px", md: "550px" }}
            fontWeight="500"
          >
            Pair trading made easy. Choose a token to short, and a token to
            long. Pectra will automatically set up a pair trade for you. Save gas,
            time, effort. Just trade your favorite pairs.
          </Text>
        </Flex>
        <Flex
          px="1.75rem"
          py="1rem"
          w="fit-content"
          h="66px"
          bg={
            colorMode === "dark"
              ? "#192213"
              : "linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))"
          }
          direction="row"
          mt="2rem"
          borderRadius={"12px"}
          alignItems="center"
          justifyItems="center"
        >
          <Text
            alignSelf="center"
            mr="0.75rem"
            variant="paragraph"
            textAlign={"center"}
          >
            Available on
          </Text>
          <Image
            ml={colorMode === "dark" ? "-0.25rem" : "-0.75rem"}
            h="58px"
            src={
              colorMode === "dark"
                ? "/icons/arbitrum-dark.svg"
                : "/icons/arbitrum-light.svg"
            }
            alt="arbitrum-logo"
          />
        </Flex>
        <Flex direction="row" mt={{ base: "2.5rem", md: "5rem" }}>
          <Button
            variant="primary"
            boxShadow="0px -1px 22px #518128"
            mr="0.5rem"
            onClick={() => router.push("/trade")}
          >
            START TRADING
          </Button>
          <Button variant="secondary">JOIN DISCORD</Button>
        </Flex>
        <Image
          display={{ base: "none", md: "block" }}
          pos="absolute"
          right="-5rem"
          top="15%"
          h={{ base: "0px", md: "500px", xl: "600px" }}
          minW={{ base: "0px", md: "300px", xl: "600px" }}
          src="/assets/spectra1.svg"
          alt="spectra-protocol-logo"
        />
        <Image
          display={{ base: "none", md: "block" }}
          pos="absolute"
          right="-4rem"
          top="15%"
          h={{ base: "0px", md: "450px", xl: "700px" }}
          minW={{ base: "0px", md: "400px", xl: "800px" }}
          src="/assets/spectra2.svg"
          alt="spectra-protocol-logo"
        />

        <SecondComp />
        <Stats />
        <Links />
      </Stack>
    </>
  );
};

export default LandingPage;
