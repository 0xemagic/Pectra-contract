import { useContractRead } from "wagmi";
import { useEffect, useState } from "react";
import {
  btcPriceQuery,
  client2,
  ethPriceQuery,
  linkPriceQuery,
  maticPriceQuery,
  truncate,
  uniPriceQuery,
} from "@/components/utils";

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

export const useReadPrices = () => {
  const [ethPrice, setEthPrice] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [linkPrice, setLinkPrice] = useState(0);
  const [uniPrice, setUniPrice] = useState(0);

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

  // function that fetches prices is used to get the price of each token asynchronously
  // should change to fetch price every few seconds instead? put into timer maybe?
  async function fetchPrices() {
    const data1 = await client2.query(ethPriceQuery, {}).toPromise();
    setEthPrice(data1.data.bundle.ethPriceUSD);

    const data2 = await client2.query(btcPriceQuery, {}).toPromise();
    setBtcPrice(data2.data.pool.token1Price * data2.data.bundle.ethPriceUSD);

    const data3 = await client2.query(linkPriceQuery, {}).toPromise();
    setLinkPrice(data3.data.pool.token1Price * data3.data.bundle.ethPriceUSD);

    const data4 = await client2.query(uniPriceQuery, {}).toPromise();
    setUniPrice(data4.data.pool.token1Price * data4.data.bundle.ethPriceUSD);
  }

  useEffect(() => {
    fetchPrices();
  }, []);

  return { btcEthRawPrice, btcEthDecimals, linkEthRawPrice, linkEthDecimals, ethPrice, btcPrice, linkPrice, uniPrice };
};
