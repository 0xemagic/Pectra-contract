import { Box, Grid, GridItem, Text, Icon, Heading } from "@chakra-ui/react";
import { AiFillInstagram } from "react-icons/ai";
import { TbBrandTwitter } from "react-icons/tb";
import { FaDiscord } from "react-icons/fa";
import { ImTelegram } from "react-icons/im";
import { SiMedium } from "react-icons/si";
import { AiFillGithub } from "react-icons/ai";

const Links = () => {
  const links = [
    {
      label: <Icon  as={AiFillInstagram} width="5.625rem" height="5.625rem" />,
      link: "https://www.instagram.com/",
    },
    {
      label: <Icon as={TbBrandTwitter} width="5.625rem" height="5.625rem" />,
      link: "https://www.twitter.com/",
    },
    {
      label: <Icon as={FaDiscord} width="5.625rem" height="5.625rem" />,
      link: "https://www.twitter.com/",
    },
    {
      label: <Icon as={ImTelegram} width="5.625rem" height="5.625rem" />,
      link: "https://www.twitter.com/",
    },
    {
      label: <Icon as={SiMedium} width="5.625rem" height="5.625rem" />,
      link: "https://www.medium.com/",
    },
    {
      label: <Icon as={AiFillGithub} width="5.625rem" height="5.625rem" />,
      link: "https://www.github.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
    {
      label: (
        <Text fontFamily="heading" fontWeight={500} fontSize="1.375rem">
          ENTER APP
        </Text>
      ),
      link: "https://www.instagram.com/",
    },
  ];
  return (
    <Box>
      <Heading
        fontWeight={500}
        fontFamily="heading"
        fontSize="3.125rem"
        mb='4.375rem'
      >
LINKS
      </Heading>
      <Grid gap='0.75rem' templateColumns={{base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)', lg: 'repeat(6, 1fr)'}}>
        {links.map((link, index) => (
          <GridItem borderRadius='20px' bg={index / 6 < 1 ? '#757575' :  '#556D55' } h='13.75rem' w='auto'
            key={index}
            colSpan={1}
            rowSpan={1}
            p={4}
            color={index / 6 >= 2 ? '#A4EF6A' : 'white'}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >{link.label}</GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default Links;