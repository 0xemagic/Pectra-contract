import { useContractWrite, usePrepareContractWrite } from "wagmi";
import ProxyABI from '../../out/LongTrade.sol/GMXAssetProxy.json'

const useContract = (args: any) => {
  const {config} = usePrepareContractWrite({
    address: '0xa82ff9afd8f496c3d6ac40e2a0f282e47488cfc9',
    abi: ProxyABI.abi,
    functionName: 'openPosition',
    args: [...args],
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  return { data, isLoading, isSuccess, write }
}

export default useContract