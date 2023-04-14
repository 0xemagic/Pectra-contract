import { useContractWrite, usePrepareContractWrite, useContractRead } from "wagmi";
import SalesABI from "../../public/abi/publicSale.json";
import erc20ABI from "../../public/abi/erc20.json";

import { BigNumber } from "ethers";
import { noSpecialCharacters } from "../utils";
import { parseUnits } from "@ethersproject/units";

const SALES_CONTRACT = "0x00006ef5eb2c94abacfc95363a4811b117ce22eb";

export const useBuyTokens = (      
  address: string,
  usdcAmount: string) => {
    const { config } = usePrepareContractWrite({
      address: SALES_CONTRACT,
      abi: SalesABI,
      functionName: "buyTokens",
      args: [parseUnits(noSpecialCharacters(usdcAmount), 6)],
    });
    const { data, isLoading, isSuccess, write } = useContractWrite(config);

    const { config: approveConfig } = usePrepareContractWrite({
      address: "0xA537aF138c1376ea9cC66501a2FfEF62a9c43630",
      abi: erc20ABI,
      functionName: "approve",
      args: [
        SALES_CONTRACT,
        parseUnits(noSpecialCharacters(usdcAmount), 6),
      ],
    });
  
    const { data: allowance } = useContractRead({
      address: "0xA537aF138c1376ea9cC66501a2FfEF62a9c43630",
      abi: erc20ABI,
      functionName: "allowance",
      args: [address, SALES_CONTRACT],
      watch: true,
    });
  
    const isApproved =
      BigNumber.isBigNumber(allowance) &&
      allowance.gte(
        parseUnits(
          noSpecialCharacters(usdcAmount),
          6
        ) ?? "0"
      );
  
    const { data: approveData, isLoading: isLoadingApprove, isSuccess: isSuccessApprove, write: writeApprove } = useContractWrite(approveConfig);
  
    return { data, isLoading, isSuccess, write,  approveData, isLoadingApprove, isSuccessApprove, writeApprove, isApproved };
  };

