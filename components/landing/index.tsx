import {
  Stack,
} from "@chakra-ui/react";
import Links from "./links";
import About from "./about";
import Stats from "./stats";
import Hero from "./hero";

const LandingPage = () => {
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
