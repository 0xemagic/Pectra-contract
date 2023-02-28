import { Box, Grid, GridItem, Link, Icon, Heading, useColorMode } from "@chakra-ui/react";
import { AiFillInstagram } from "react-icons/ai";
import { TbBrandTwitter } from "react-icons/tb";
import { FaDiscord } from "react-icons/fa";
import { ImTelegram } from "react-icons/im";
import { SiMedium } from "react-icons/si";
import { AiFillGithub } from "react-icons/ai";

const Links = () => {
  const { colorMode } = useColorMode();
  const links = [
    // {
    //   label: <Icon as={AiFillInstagram} width="5.625rem" height="5.625rem" />,
    //   link: "https://www.instagram.com/spectra-protocol",
    // },
    {
      label: <Icon as={TbBrandTwitter} width="5.625rem" height="5.625rem" />,
      link: "https://www.twitter.com/spectra_protocol",
    },
    {
      label: <Icon as={FaDiscord} width="5.625rem" height="5.625rem" />,
      link: " https://discord.gg/RKNRDVeFwG",
    },
    // {
    //   label: <Icon as={ImTelegram} width="5.625rem" height="5.625rem" />,
    //   link: "https://www.telegram.com/spectra-protocol",
    // },
    {
      label: <Icon as={SiMedium} width="5.625rem" height="5.625rem" />,
      link: "https://www.medium.com/spectra-protocol",
    },
    {
      label: <Icon as={AiFillGithub} width="5.625rem" height="5.625rem" />,
      link: "https://www.github.com/spectra-protocol",
    },
  ];
  return (
    <Box pt="10rem" pb="10rem">
      <Heading
        fontWeight={500}
        fontFamily="heading"
        fontSize="3.125rem"
        mb="4.375rem"
      >
        LINKS
      </Heading>
      <Grid
        gap="0.75rem"
        templateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(5, 1fr)",
          lg: "repeat(6, 1fr)",
        }}
      >
        {links.map((link, index) => (
          <Link href={link.link} key={index}
          >
            <GridItem
              borderRadius="20px"
              bg={colorMode === "dark" ? "#272D22" : "#F5F5F5"}
              h="10rem"
              w="auto"
              colSpan={1}
              rowSpan={1}
              p={4}
              color={colorMode === "dark" ? "white" : "#757575"}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {link.label}
            </GridItem>
          </Link>
        ))}
      </Grid>
    </Box>
  );
};

export default Links;
