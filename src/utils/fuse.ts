import { ethers, BigNumber } from "ethers";
import {
  FusePoolDirectory__factory,
  FusePoolLens__factory,
  FusePoolDirectory,
  FusePoolLens,
} from "../types";
import { addresses } from "../constants";

export interface FusePoolAsset {
  cToken: string;
  underlyingToken: string;
  underlyingName: string;
  underlyingSymbol: string;
  underlyingDecimals: BigNumber;
  underlyingBalance: BigNumber;
  supplyRatePerBlock: BigNumber;
  borrowRatePerBlock: BigNumber;
  totalSupply: BigNumber;
  totalBorrow: BigNumber;
  supplyBalance: BigNumber;
  borrowBalance: BigNumber;
  liquidity: BigNumber;
  membership: boolean;
  exchangeRate: BigNumber;
  underlyingPrice: BigNumber;
  oracle: string;
  collateralFactor: BigNumber;
  reserveFactor: BigNumber;
  adminFee: BigNumber;
  fuseFee: BigNumber;
}

export interface FusePool {
  name: string;
  comptroller: string;
  assets: FusePoolAsset[];
}

const ethMantissa = 1e18;
const blocksPerDay = 6570; // 13.15 seconds per block
const daysPerYear = 365;

export async function getPools(
  provider: ethers.providers.Provider,
  chainId: number
): Promise<
  {
    name: string;
    comptroller: string;
  }[]
> {
  const fusePoolDirectory: FusePoolDirectory =
    FusePoolDirectory__factory.connect(
      addresses[chainId].fusePoolDirectory,
      provider
    );
  const publicPools: [
    ethers.BigNumber[],
    [string, string, string, ethers.BigNumber, ethers.BigNumber][]
  ] = await fusePoolDirectory.getPublicPools();
  return publicPools[1].map((pool) => ({
    name: pool[0],
    comptroller: pool[2],
  }));
}

export async function getPoolAssets(
  provider: ethers.providers.Provider,
  chainId: number,
  pools: { comptroller: string }[]
): Promise<FusePoolAsset[][]> {
  const fusePoolLens: FusePoolLens = FusePoolLens__factory.connect(
    addresses[chainId].fusePoolLens,
    provider
  );

  const getPoolAssetsWithData = await Promise.all(
    pools.map((pool) =>
      fusePoolLens.callStatic.getPoolAssetsWithData(pool.comptroller)
    )
  );

  return getPoolAssetsWithData.map((pool) =>
    pool.map((asset) => ({
      cToken: asset[0],
      underlyingToken: asset[1],
      underlyingName: asset[2],
      underlyingSymbol: asset[3],
      underlyingDecimals: asset[4],
      underlyingBalance: asset[5],
      supplyRatePerBlock: asset[6],
      borrowRatePerBlock: asset[7],
      totalSupply: asset[8],
      totalBorrow: asset[9],
      supplyBalance: asset[10],
      borrowBalance: asset[11],
      liquidity: asset[12],
      membership: asset[13],
      exchangeRate: asset[14],
      underlyingPrice: asset[15],
      oracle: asset[16],
      collateralFactor: asset[17],
      reserveFactor: asset[18],
      adminFee: asset[19],
      fuseFee: asset[20],
    }))
  );
}

export function calculateApy(ratePerBlock: BigNumber): number {
  return (
    (Math.pow(
      (ratePerBlock.toNumber() / ethMantissa) * blocksPerDay + 1,
      daysPerYear
    ) -
      1) *
    100
  );
}
