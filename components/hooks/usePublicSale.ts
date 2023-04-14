import { useContractWrite, usePrepareContractWrite, useContractRead } from "wagmi";
import salesABI from "../../public/abi/publicSale.json";
import erc20ABI from "../../public/abi/erc20.json";

import { BigNumber } from "ethers";
import { noSpecialCharacters } from "../utils";
import { parseUnits } from "@ethersproject/units";

const SALES_CONTRACT = "0x5a1efce55840e2f5b49f2ff7e5061712e6fa3151";
const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"

export const useBuyTokens = (      
  address?: string,
  amount?: string) => {
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
      args: [
        SALES_CONTRACT,
        amount ? parseUnits(amount!, 6) : 0
      ],
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
  
    const isApproved =
      BigNumber.isBigNumber(allowance) &&
      allowance.gte(
        amount ? parseUnits(amount!, 6) : 0 ?? "0"
      );
  
    const { data: approveData, isLoading: isLoadingApprove, isSuccess: isSuccessApprove, write: writeApprove } = useContractWrite(approveConfig);
  
    return { data, isLoading, isSuccess, write,  approveData, isLoadingApprove, isSuccessApprove, writeApprove, isApproved, publicPectraBalance, spectraPrice, tokensSold };
  };

