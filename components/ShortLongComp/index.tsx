import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import CloseComp from "../CloseComp";
import OpenComp from "../OpenComp";

const ShortLongComp = () => {
  return (
    <>
      <Tabs borderRadius="2xl" isFitted variant="unstyled">
        <TabList borderRadius="7px" bg="#303030">
          <Tab
            _selected={{
              bg: "#444444",
              borderColor: "rgba(255, 255, 255, 0.2)",
              borderWidth: "2px",
              borderRadius: "7px",
            }}
          >
            Open
          </Tab>
          <Tab
            _selected={{
              bg: "#444444",
              borderColor: "rgba(255, 255, 255, 0.2)",
              borderWidth: "2px",
              borderRadius: "7px",
            }}
          >
            Close
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <OpenComp />
          </TabPanel>
          <TabPanel>
            <CloseComp />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default ShortLongComp;
