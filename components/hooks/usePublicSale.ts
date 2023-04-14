import {
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import erc20ABI from "../../public/abi/erc20.json";
import salesABI from "../../public/abi/publicSale.json";

import { parseUnits } from "@ethersproject/units";
import { BigNumber, BigNumberish } from "ethers";
import { formatUnits } from "@ethersproject/units";

const SALES_CONTRACT =
  typeof process.env.NEXT_PUBLIC_SALE_CONTRACT === "string"
    ? (process.env.NEXT_PUBLIC_SALE_CONTRACT as `0x${string}`)
    : "0x5a1efce55840e2f5b49f2ff7e5061712e6fa3151";

const USDC =
  typeof process.env.NEXT_PUBLIC_SALE_USDC === "string"
    ? (process.env.NEXT_PUBLIC_SALE_USDC as `0x${string}`)
    : "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";

export const useBuyTokens = (address?: string, amount?: string) => {
  // const { config } = usePrepareContractWrite({
  //   address: SALES_CONTRACT,
  //   abi: salesABI,
  //   functionName: "buyTokens",
  //   args: [amount ? parseUnits(amount!, 6) : 0],
  // });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "buyTokens",
    args: [amount ? parseUnits(amount!, 6) : 0],
  });

  const {  data: approveData,
    isLoading: isLoadingApprove,
    isSuccess: isSuccessApprove,
    write: writeApprove,
    status: approveStatus, } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: USDC,
    abi: erc20ABI,
    functionName: "approve",
    args: [SALES_CONTRACT, amount ? parseUnits(amount!, 6) : 0],
  });

  // const {
  //   data: approveData,
  //   isLoading: isLoadingApprove,
  //   isSuccess: isSuccessApprove,
  //   write: writeApprove,
  //   status: approveStatus,
  // } = useContractWrite(approveConfig);

  // const { config: approveConfig } = usePrepareContractWrite({
  //   address: USDC,
  //   abi: erc20ABI,
  //   functionName: "approve",
  //   args: [SALES_CONTRACT, amount ? parseUnits(amount!, 6) : 0],
  // });

  const { data: allowance } = useContractRead({
    address: USDC,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, SALES_CONTRACT],
    watch: true,
  });

  const { data: publicPectraBalance } = useContractRead({
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "tokenBalances",
    args: [address],
  });

  const { data: spectraPrice } = useContractRead({
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "pricePerToken",
  });

  const { data: tokensSold } = useContractRead({
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "totalTokensSold",
  });

  const { data: isPaused } = useContractRead({
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "isPaused",
  });

  const isApproved = allowance && +formatUnits(allowance as BigNumberish, 6) >= +amount!



  const {
    data: usdcBalance,
    isError,
    isLoading: balanceLoading,
  } = useBalance({
    address: address! as any,
    token: USDC,
  });

  return {
    data,
    isLoading,
    isSuccess,
    write,
    approveData,
    isLoadingApprove,
    isSuccessApprove,
    approveStatus,
    writeApprove,
    isApproved,
    publicPectraBalance,
    spectraPrice,
    tokensSold,
    isPaused,
    usdcBalance,
  };
};

export const usePublicSale = () => {
  const { data: isPaused } = useContractRead({
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "isPaused",
    watch: true,
    cacheTime: 15_000,
  });
  const { data: saleEndEpoch } = useContractRead({
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "saleEndEpoch",
  });
  return {
    isPaused,
    saleEndEpoch,
    saleEndDate: saleEndEpoch
      ? new Date((saleEndEpoch as number) * 1000 ?? 0)
      : undefined,
  };
};

export const useSaleAdmin = () => {
  const { data: isPaused } = useContractRead({
    address: "0x5a1eFce55840E2f5b49F2ff7e5061712e6fA3151",
    abi: salesABI,
    functionName: "isPaused",
    watch: true,
    cacheTime: 15_000,
  });
  const { config } = usePrepareContractWrite({
    address: "0x5a1eFce55840E2f5b49F2ff7e5061712e6fA3151",
    abi: salesABI,
    functionName: "togglePause",
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  return { data, isLoading, isSuccess, togglePause: write, isPaused };
};
