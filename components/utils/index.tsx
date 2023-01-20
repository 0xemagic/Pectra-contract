import { createClient } from "urql";

export const trimAddress = (
  address: string,
  firstSlice: number,
  secondSlice: number
) => address?.slice(0, firstSlice) + "..." + address?.slice(secondSlice);

export function truncate(str: string, maxDecimalDigits: number) {
  if (str.includes(".")) {
    const parts = str.split(".");
    return parts[0] + "." + parts[1].slice(0, maxDecimalDigits);
  }
  return str;
}

export const noSpecialCharacters = (str: string) => {
  return str.replace(/[^0-9.]/g, "");
};

export const client2 = createClient({
  url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
});

// this one uses client
export const btcPriceQuery = `
{
	bundle(id: "1" ) {
	 ethPriceUSD
   }
    pool(id:"0x4585fe77225b41b697c938b018e2ac67ac5a20c0") {
      token1Price
    }
}
`;

export const pairOracleQuery = `
{
  pool(id: "0x4585fe77225b41b697c938b018e2ac67ac5a20c0") {
    token1Price
    poolDayData{
      date,
      sqrtPrice
    }
  }
}`

// this one uses client2
export const ethPriceQuery = `
{
	bundle(id: "1" ) {
    ethPriceUSD
    }
  }
`;

