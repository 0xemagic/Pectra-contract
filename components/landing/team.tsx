import { Flex, Heading, Circle, Text, Box, useColorMode } from '@chakra-ui/react';
import { RiTwitterFill, RiGithubFill } from 'react-icons/ri';



const PectraTeam = () => {
    const { colorMode } = useColorMode();
    const teamMembers = [
        {
            imageSrc: '/path/to/huf_image.jpg',
            name: 'Huf',
            role: 'Co-Founder',
            links: [{
                url: 'https://twitter.com/hufhaus9', icon: <RiTwitterFill
                    color={colorMode === "dark" ? "#FFFFFF" : "#222222"} size="32px" />}],        },
        {
            imageSrc: '/path/to/math_image.jpg',
            name: 'Math',
            role: 'Co-Founder / CTO',
            links: [{
                url: 'https://twitter.com/mathdroid', icon: <RiTwitterFill
                    color={colorMode === "dark" ? "#FFFFFF" : "#222222"}
                    size="32px"
                />
            }, { url: 'https://github.com/mathdroid', icon: <RiGithubFill color={colorMode === "dark" ? "#FFFFFF" : "#222222"}
            size="32px"/>}],
        },
        {
            imageSrc: '/path/to/nev_image.jpg',
            name: 'Nev',
            role: 'Head of Partnerships',
            links: [{
                url: 'https://twitter.com/pray4profit', icon: <RiTwitterFill
                    color={colorMode === "dark" ? "#FFFFFF" : "#222222"} size="32px" />}],
        },
        {
            imageSrc: '/path/to/bob_image.jpg',
            name: 'Bob',
            role: 'COO',
            links: [{
                url: 'https://twitter.com/profbobx', icon: <RiTwitterFill
                    color={colorMode === "dark" ? "#FFFFFF" : "#222222"} size="32px" />}],        },
    ];
    return (
        <Flex
            w="100%"
            direction="column"
            alignItems="center"
            pt="10rem"
        >
            <Flex mb="5rem">            <Heading variant="colored" color="brand" mr="0.5rem" mb={4}>Pectra</Heading>
                <Heading variant="hero" mb={4}>
                    Team        </Heading>     </Flex>

            <Flex w="100%" alignItems="center"
                justify="space-around"
                direction={{ 
                    base: 'column',
                    md: 'row',
                }}
            >
                {teamMembers.map((member, index) => (
                    <Flex
                        key={index}
                        direction="column"
                        alignItems="center"
                    >
                        <Circle
                            size="120px"
                            bg="gray.200"
                            backgroundImage={`url(${member.imageSrc})`}
                            backgroundSize="cover"
                            backgroundPosition="center"
                        />
                        <Heading as="h2" size="sm" color="brand" mt={2}>
                            {member.name}
                        </Heading>
                        <Text variant="paragraph" mt={1}>
                            {member.role}
                        </Text>
                        <Flex>
                            {member.links.map((link, index) => (
                                <Box
                                    mx="0.5rem"
                                    key={index}
                                    as="a"
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    _hover={{ textDecoration: 'none' }}
                                    _focus={{ textDecoration: 'none' }}
                                    _active={{ textDecoration: 'none' }}
                                >
                                    {link.icon}
                                </Box>
                            ))}
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
};

export default PectraTeam;