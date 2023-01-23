import PositionComp, { PositionCompProps } from "@/components/ShortLongPos";
import {
  Box,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

const Overview = () => {
  const positions: PositionCompProps[] = [
    {
      position: "LONG",
      asset: "ETH",
      assetAmount: "10x",
      dateOpened: "1/11/23",
      data: ["+2220", "USDC"],
    },
    {
      position: "SHORT",
      asset: "ETH",
      assetAmount: "10x",
      dateOpened: "1/11/23",
      data: ["ENTRY LEVEL", "CURRENT LEVEL", "LEVERAGE", "PNL"],
    },
    {
      position: "LONG",
      asset: "ETH",
      assetAmount: "10x",
      dateOpened: "1/11/23",

    },
    {
      position: "LONG",
      asset: "ETH",
      assetAmount: "10x",
      dateOpened: "1/11/23",

    },
    {
      position: "LONG",
      asset: "ETH",
      assetAmount: "10x",
      dateOpened: "1/11/23",

    },
    {
      position: "LONG",
      asset: "ETH",
      assetAmount: "10x",
      dateOpened: "1/11/23",

    },
    {
      position: "SHORT",
      asset: "ETH",
      assetAmount: "10x",
      dateOpened: "1/11/23",

    },
    {
      position: "SHORT",
      asset: "ETH",
      assetAmount: "10x",
      dateOpened: "1/11/23",

    },
    {
      position: "LONG",
      asset: "ETH",
      assetAmount: "10x",
      dateOpened: "1/11/23",

    },
  ];
  return (
    <Box px="4.25rem" mt="3.3125rem">
      <Box
        h="fit-content"
        w="full"
        borderRadius={"0.5rem"}
        background="#202020"
        border="2px solid #404040"
        fontWeight="bold"
        px="1.68rem"
        py="1.5rem"
        fontSize="1.25rem"
        mb="2.25rem"
      >
        Overview
      </Box>
      <Box w="full" borderRadius="7px" bg="#303030" py="1.25rem" px="1.6875rem">
        <Tabs borderRadius="2xl" isFitted variant="unstyled">
          <TabList w="33rem" borderRadius="7px" bg="#303030">
            <Tab
              w="16.8rem"
              _selected={{
                bg: "#444444",
                borderColor: "rgba(255, 255, 255, 0.2)",
                borderWidth: "2px",
                borderRadius: "7px",
                mr: "-0.25rem",
                borderRight: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              border="1px solid rgba(255, 255, 255, 0.2)"
              borderRight="none"
              borderLeftRadius="7px"
            >
              Open
            </Tab>
            <Tab
              w="16.8rem"
              _selected={{
                bg: "#444444",
                borderColor: "rgba(255, 255, 255, 0.2)",
                borderWidth: "2px",
                borderRadius: "7px",
                ml: "-0.25rem",
                borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              border="1px solid rgba(255, 255, 255, 0.2)"
              borderLeft="none"
              borderRightRadius="7px"
            >
              Close
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid gap="1.875rem" templateColumns="repeat(3, 1fr)">
                {positions.map(
                  (
                    { position, asset, assetAmount, dateOpened, data },
                    index
                  ) => (
                    <GridItem key={index}>
                      <PositionComp
                        position={position}
                        asset={asset}
                        assetAmount={assetAmount}
                        dateOpened={dateOpened}
                        data={data}
                      />
                    </GridItem>
                  )
                )}
              </Grid>
            </TabPanel>
            <TabPanel></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Overview;
