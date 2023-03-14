import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
  Box
} from "@chakra-ui/react";
import OpenComp from "../OpenComp";
import OpenPositions from "../PositionsTable";

type ModeCompProps = {
  handleTabsChange: (index: number) => void;
  tabIndex: number;
  handleSymbolChange: (selectedValue: string) => void;
  symbols: any;
}

const ModeComp = ({handleTabsChange, tabIndex, handleSymbolChange, symbols}: ModeCompProps) => {
  return (
    <Flex >
      <Tabs w="fit-content" borderRadius="2xl" isFitted variant="unstyled" index={tabIndex} onChange={handleTabsChange}>
        <TabList borderRadius="7px" bg="#303030" w={tabIndex === 0 ? "100%" : "400px" }>
          <Tab
            _selected={{
              bg: "#444444",
              borderColor: "rgba(255, 255, 255, 0.2)",
              borderWidth: "2px",
              borderRadius: "7px",
              mr: "-0.25rem",
              borderRight: "1px solid rgba(255, 255, 255, 0.2)"
            }}
            border="1px solid rgba(255, 255, 255, 0.2)"
            borderRight="none"
            borderLeftRadius="7px"
          >
            TRADE
          </Tab>
          <Tab
            _selected={{
              bg: "#444444",
              borderColor: "rgba(255, 255, 255, 0.2)",
              borderWidth: "2px",
              borderRadius: "7px",
              ml: "-0.25rem",
              borderLeft: "1px solid rgba(255, 255, 255, 0.2)"
            }}
            border="1px solid rgba(255, 255, 255, 0.2)"
            borderLeft="none"
            borderRightRadius="7px"
            w="100%"
          >
            POSITIONS
          </Tab>
        </TabList>
        <TabPanels >
          <TabPanel>
            <OpenComp handleSymbolChange={handleSymbolChange} symbols={symbols} />
          </TabPanel>
          <TabPanel >
            <Box w="100%">
            <OpenPositions tabIndex={tabIndex} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default ModeComp;