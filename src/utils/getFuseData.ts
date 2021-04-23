import { ethers } from "ethers";
import { providers } from "@0xsequence/multicall";
import { fusePoolDirectoryAddress, mkrAddress } from "../constants";
import {
  ERC20__factory,
  CToken__factory,
  FusePoolDirectory__factory,
  FusePoolDirectory,
  Comptroller__factory,
} from "../contracts/types";
import getDefaultProvider from "./getDefaultProvider";

export interface FuseData {
  name: string;
  comptroller: string;
  markets: string[];
  addresses: string[];
  tokens: string[];
}

async function getMarkets(
  provider: ethers.providers.Provider,
  fusePool: [string, string, string, ethers.BigNumber, ethers.BigNumber]
): Promise<[string[], string[], string[]]> {
  const poolMarkets: string[] = await Comptroller__factory.connect(
    fusePool[2],
    provider
  ).getAllMarkets();
  const getMarketsUnderlying: Promise<string>[] = poolMarkets.map(
    (market: string) => CToken__factory.connect(market, provider).underlying()
  );
  const marketsUnderlying: string[] = await Promise.all(getMarketsUnderlying);
  const getTokenSymbols: Promise<string>[] = marketsUnderlying.map((token) => {
    if (token == ethers.constants.AddressZero) {
      return new Promise((resolve) => resolve("ETH"));
    } else if (token === mkrAddress) {
      return new Promise((resolve) => resolve("MKR"));
    } else {
      return ERC20__factory.connect(token, provider).symbol();
    }
  });
  const tokenSymbols: string[] = await Promise.all(getTokenSymbols);
  return [poolMarkets, marketsUnderlying, tokenSymbols];
}

async function getFuseData(
  currentProvider: ethers.providers.Web3Provider | undefined
): Promise<FuseData[]> {
  const provider: ethers.providers.Provider = new providers.MulticallProvider(
    currentProvider || getDefaultProvider()
  );
  const fusePoolDirectory: FusePoolDirectory = FusePoolDirectory__factory.connect(
    fusePoolDirectoryAddress,
    provider
  );
  const publicPools: [
    ethers.BigNumber[],
    [string, string, string, ethers.BigNumber, ethers.BigNumber][]
  ] = await fusePoolDirectory.getPublicPools();
  const getPoolData: Promise<[string[], string[], string[]]>[] = [];
  for (const fusePool of publicPools[1]) {
    getPoolData.push(getMarkets(provider, fusePool));
  }
  const poolData: [string[], string[], string[]][] = await Promise.all(
    getPoolData
  );
  const fuseData: FuseData[] = publicPools[1].map(
    (
      pool: [string, string, string, ethers.BigNumber, ethers.BigNumber],
      index: number
    ): FuseData => ({
      name: pool[0],
      comptroller: pool[2],
      markets: poolData[index][0],
      addresses: poolData[index][1],
      tokens: poolData[index][2],
    })
  );
  return fuseData;
}

export default getFuseData;
