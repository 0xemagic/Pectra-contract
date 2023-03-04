import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import OpenComp from "../OpenComp";
import OpenPositions from "../PositionsTable";

type ModeCompProps = {
  handleTabsChange: (index: number) => void;
  tabIndex: number;
}

const ModeComp = ({handleTabsChange, tabIndex}: ModeCompProps) => {


  return (
    <>
      <Tabs borderRadius="2xl" isFitted variant="unstyled" index={tabIndex} onChange={handleTabsChange}>
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
          >
            POSITIONS
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <OpenComp />
          </TabPanel>
          <TabPanel>
            <OpenPositions />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default ModeComp;