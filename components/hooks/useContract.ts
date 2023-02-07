import { useContractWrite, usePrepareContractWrite } from "wagmi";
import ProxyABI from "../../out/LongTrade.sol/GMXAssetProxy.json";

const PROXY_CONTRACT_ADDRESS = "0x3f0E5149E48638acA58129850eB23B6641076F54";

export const useWriteOpenPosition = (args: any) => {
  const { config } = usePrepareContractWrite({
    address: PROXY_CONTRACT_ADDRESS,
    abi: ProxyABI.abi,
    functionName: "openPosition",
    args: [...args],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return { data, isLoading, isSuccess, write };
};

export const useWriteClosePosition = (args: any) => {
  const { config } = usePrepareContractWrite({
    address: PROXY_CONTRACT_ADDRESS,
    abi: ProxyABI.abi,
    functionName: "closePosition",
    args: [...args],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return { data, isLoading, isSuccess, write };
}

