import { ethers } from "ethers";
import { fusePoolDirectoryAddress, mkrAddress } from "../constants";
import {
  ERC20__factory,
  CToken__factory,
  FusePoolDirectory__factory,
  FusePoolDirectory,
  Comptroller__factory,
  Comptroller,
} from "../contracts/types";
import getDefaultProvider from "./getDefaultProvider";

export interface FuseData {
  name: string;
  comptroller: string;
  markets: string[];
  addresses: string[];
  tokens: string[];
}

async function getFuseData(
  currentProvider: ethers.providers.Web3Provider | undefined
): Promise<FuseData[]> {
  const provider: ethers.providers.Provider =
    currentProvider || getDefaultProvider();
  const fusePoolDirectory: FusePoolDirectory = FusePoolDirectory__factory.connect(
    fusePoolDirectoryAddress,
    provider
  );
  const publicPools: [
    ethers.BigNumber[],
    ([string, string, string, ethers.BigNumber, ethers.BigNumber] & {
      name: string;
      creator: string;
      comptroller: string;
      blockPosted: ethers.BigNumber;
      timestampPosted: ethers.BigNumber;
    })[]
  ] = await fusePoolDirectory.getPublicPools();
  const getPoolMarkets: Promise<string[]>[] = [];
  for (let i = 0; i < publicPools[1].length; i++) {
    const fusePool: Comptroller = Comptroller__factory.connect(
      publicPools[1][i][2],
      provider
    );
    getPoolMarkets.push(fusePool.getAllMarkets());
  }
  const poolMarkets: string[][] = await Promise.all(getPoolMarkets);
  const poolTokens: string[][] = [];
  for (const market of poolMarkets) {
    const getPoolTokens: Promise<string>[] = [];
    for (const token of market) {
      getPoolTokens.push(CToken__factory.connect(token, provider).underlying());
    }
    poolTokens.push(await Promise.all(getPoolTokens));
  }
  const tokensList: string[][] = [];
  for (const tokens of poolTokens) {
    const getTokens: Promise<string>[] = [];
    for (const token of tokens) {
      if (token == ethers.constants.AddressZero) {
        getTokens.push(new Promise((resolve) => resolve("ETH")));
      } else if (token === mkrAddress) {
        getTokens.push(new Promise((resolve) => resolve("MKR")));
      } else {
        getTokens.push(ERC20__factory.connect(token, provider).symbol());
      }
    }
    tokensList.push(await Promise.all(getTokens));
  }
  const fuseData: FuseData[] = publicPools[1].map(
    (
      pool: [string, string, string, ethers.BigNumber, ethers.BigNumber] & {
        name: string;
        creator: string;
        comptroller: string;
        blockPosted: ethers.BigNumber;
        timestampPosted: ethers.BigNumber;
      },
      index: number
    ): FuseData => ({
      name: pool[0],
      comptroller: pool[2],
      markets: poolMarkets[index],
      addresses: poolTokens[index],
      tokens: tokensList[index],
    })
  );
  return fuseData;
}

export default getFuseData;
