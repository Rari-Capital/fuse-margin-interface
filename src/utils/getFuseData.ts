import { ethers } from "ethers";
import { fusePoolDirectoryAddress } from "../constants";
import {
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
}

async function getFuseData(
  currentProvider: ethers.providers.Web3Provider | undefined
): Promise<FuseData[]> {
  const provider: ethers.providers.Provider =
    currentProvider || getDefaultProvider();
  const fusePoolDirectory: FusePoolDirectory = await FusePoolDirectory__factory.connect(
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
    const fusePool: Comptroller = await Comptroller__factory.connect(
      publicPools[1][i][2],
      provider
    );
    getPoolMarkets.push(fusePool.getAllMarkets());
  }
  const poolMarkets: string[][] = await Promise.all(getPoolMarkets);
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
    })
  );
  return fuseData;
}

export default getFuseData;
