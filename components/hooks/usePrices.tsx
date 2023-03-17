import { useContractRead } from "wagmi";

const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const BTCETH = "0xc5a90A6d7e4Af242dA238FFe279e9f2BA0c64B2e";
const LINKETH = "0xb7c8Fb1dB45007F98A68Da0588e1AA524C317f27";

export const useReadPrice = () => {
  const { data: btcEthRawPrice, isLoading } = useContractRead({
    address: BTCETH,
    abi: aggregatorV3InterfaceABI,
    functionName: "latestRoundData",
    watch: true,
  });

  const { data: btcEthDecimals } = useContractRead({
    address: BTCETH,
    abi: aggregatorV3InterfaceABI,
    functionName: "decimals",
    watch: true,  });

  const { data: linkEthRawPrice } = useContractRead({
    address: LINKETH,
    abi: aggregatorV3InterfaceABI,
    functionName: "latestRoundData",
    watch: true,  });

  const { data: linkEthDecimals } = useContractRead({
    address: LINKETH,
    abi: aggregatorV3InterfaceABI,
    functionName: "decimals",
    watch: true,
  });

  return { btcEthRawPrice, btcEthDecimals, linkEthRawPrice, linkEthDecimals };
};
