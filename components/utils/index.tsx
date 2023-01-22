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

export const ethPriceQuery = `
{
	bundle(id: "1" ) {
    ethPriceUSD
    }
  }
`;

export const linkPriceQuery = `
{
  bundle(id: "1" ) {
    ethPriceUSD
    }   
    pool(id:"0xa6cc3c2531fdaa6ae1a3ca84c2855806728693e8") {
      token1Price
    }
  }
  `;

  export const uniPriceQuery = `
{
  bundle(id: "1" ) {
    ethPriceUSD
    }   
    pool(id:"0x1d42064fc4beb5f8aaf85f4617ae8b3b5b8bd801") {
      token1Price
    }
  }
  `;

  export const maticPriceQuery = `
  {
    bundle(id: "1" ) {
      ethPriceUSD
      }   
      pool(id:"0x290a6a7460b308ee3f19023d2d00de604bcf5b42") {
        token1Price
      }
    }
    `;


  