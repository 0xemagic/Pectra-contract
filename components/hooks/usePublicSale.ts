import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import erc20ABI from "../../public/abi/erc20.json";
import salesABI from "../../public/abi/publicSale.json";

import { parseUnits } from "@ethersproject/units";
import { BigNumber } from "ethers";

const SALES_CONTRACT =
  typeof process.env.NEXT_PUBLIC_SALE_CONTRACT === "string"
    ? (process.env.NEXT_PUBLIC_SALE_CONTRACT as `0x${string}`)
    : "0x00006ef5eb2c94abacfc95363a4811b117ce22eb";
const USDC =
  typeof process.env.NEXT_PUBLIC_SALE_USDC === "string"
    ? (process.env.NEXT_PUBLIC_SALE_USDC as `0x${string}`)
    : "0x00006ef5eb2c94abacfc95363a4811b117ce22eb";

export const useBuyTokens = (address?: string, amount?: string) => {
  const { config } = usePrepareContractWrite({
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "buyTokens",
    args: [amount ? parseUnits(amount!, 6) : 0],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const { config: approveConfig } = usePrepareContractWrite({
    address: USDC,
    abi: erc20ABI,
    functionName: "approve",
    args: [SALES_CONTRACT, amount ? parseUnits(amount!, 6) : 0],
  });

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
    watch: true,
  });

  const { data: spectraPrice } = useContractRead({
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "pricePerToken",
    watch: true,
  });

  const { data: tokensSold } = useContractRead({
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "totalTokensSold",
    watch: true,
  });

  const { data: isPaused } = useContractRead({
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "isPaused",
    watch: true,
  });

  const isApproved =
    BigNumber.isBigNumber(allowance) &&
    allowance.gte(amount ? parseUnits(amount!, 6) : 0 ?? "0");

  const {
    data: approveData,
    isLoading: isLoadingApprove,
    isSuccess: isSuccessApprove,
    write: writeApprove,
  } = useContractWrite(approveConfig);

  return {
    data,
    isLoading,
    isSuccess,
    write,
    approveData,
    isLoadingApprove,
    isSuccessApprove,
    writeApprove,
    isApproved,
    publicPectraBalance,
    spectraPrice,
    tokensSold,
    isPaused,
  };
};

export const usePublicSale = () => {
  const { data: isPaused } = useContractRead({
    address: SALES_CONTRACT,
    abi: salesABI,
    functionName: "isPaused",
    watch: true,
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
