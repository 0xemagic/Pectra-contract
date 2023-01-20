import { useState, useEffect } from "react";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import CloseComp from "../CloseComp";
import OpenComp from "../OpenComp";

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
              mr: "-0.25rem",
              borderRight: "1px solid rgba(255, 255, 255, 0.2)"
            }}
            border="1px solid rgba(255, 255, 255, 0.2)"
            borderRight="none"
            borderLeftRadius="7px"
          >
            Open
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
      </Tabs>
     
    </>
  );
};

export default ShortLongComp;