import {
    Flex,
    Heading,
} from "@chakra-ui/react";

import Front from "./front";
import Dashboard from "./dashboard";

import { useBuyTokens } from "../hooks/usePublicSale";
import { useAccount } from "wagmi";

export default function SalesPage() {
    const { address, isConnecting, isDisconnected } = useAccount();
    const { publicPectraBalance } = useBuyTokens(
        address!
    );

    return (
        <>
            {process.env.NODE_ENV === "production" ? (
                <Flex w="full">
                    <Heading m="auto" mt="20%">Coming Soon</Heading>
                </Flex>)
                : (
                    <>
                        {
                            publicPectraBalance! > 0 ? <Dashboard publicPectraBalance={publicPectraBalance} /> : <Front />
                        }
                    </>
                )}
        </>
    )
}