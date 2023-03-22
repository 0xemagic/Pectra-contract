// import PositionComp, { PositionCompProps } from "@/components/trade";
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Heading
  } from "@chakra-ui/react";
  
  import { NextSeo } from "next-seo";
  
  const FAQ = () => {
    return (
      <>
        <NextSeo
          title="Pectra Protocol FAQs"
          description="Pair trading made easy."
          openGraph={{
            title: "Pectra Protocol FAQs",
            description: "Pair trading made easy.",
            images: [
              {
                url: "https://www.spectraprotocol.com/spectra-protocol.png",
                width: 800,
                height: 600,
                alt: "Pectra Protocol",
              },
            ],
          }}
        />
        {process.env.NODE_ENV === "production" ? (
          <Flex w="full">
            <Heading m="auto" mt="20%">Coming Soon</Heading>
          </Flex>
        ) : (
          <>
            <Box px="4.25rem" mt="3.3125rem">
                <Heading>FAQ</Heading>
            </Box>
        </>)}
      </>
    );
  };
  
  export default FAQ;
  