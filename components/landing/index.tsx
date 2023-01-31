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
import Links from "./links";
import About from "./about";
import Stats from "./stats";
import Hero from "./hero";

const LandingPage = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  return (
    <Stack px={{base: "2rem", md: "4rem"}}>
      <Hero/>
      <About />
        <Stats />
        <Links />
    </Stack>
  );
};

export default LandingPage;
