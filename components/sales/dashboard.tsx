import {
    Flex,
    Text,
    Heading,
    Button,
    useColorMode,
} from "@chakra-ui/react";

import { AiOutlineInfoCircle } from "react-icons/ai";

import { useAccount } from "wagmi";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Dashboard() {
    const { address, isConnecting, isDisconnected } = useAccount();

    return (
        <Flex>
            <Flex
            
            >

            </Flex>
        </Flex>
    )
}