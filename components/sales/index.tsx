import Front from "./front";
import Dashboard   from "./dashboard";

import { useBuyTokens } from "../hooks/usePublicSale";
import { useAccount } from "wagmi";

export default function SalesPage() {
    const { address, isConnecting, isDisconnected } = useAccount();
    const { publicPectraBalance } = useBuyTokens(
        address!    
    );

    return (
        <>
        {
            publicPectraBalance! > 0 ? <Dashboard publicPectraBalance={publicPectraBalance} /> : <Front />
        }
        {/* <Front />
        <Dashboard /> */}
        </>
    )
}