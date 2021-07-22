import { ethers, BigNumber } from "ethers";
import { FusePoolLens__factory, FusePoolLens } from "../types";
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
  totalSupply: BigNumber;
  totalBorrow: BigNumber;
  underlyingTokens: string[];
  underlyingSymbols: string[];
  assets: FusePoolAsset[];
}

export interface SerializedFusePoolAsset {
  cToken: string;
  underlyingToken: string;
  underlyingName: string;
  underlyingSymbol: string;
  underlyingDecimals: string;
  underlyingBalance: string;
  supplyRatePerBlock: string;
  borrowRatePerBlock: string;
  totalSupply: string;
  totalBorrow: string;
  supplyBalance: string;
  borrowBalance: string;
  liquidity: string;
  membership: boolean;
  exchangeRate: string;
  underlyingPrice: string;
  oracle: string;
  collateralFactor: string;
  reserveFactor: string;
  adminFee: string;
  fuseFee: string;
}

export interface SerializedFusePool {
  name: string;
  comptroller: string;
  totalSupply: string;
  totalBorrow: string;
  underlyingTokens: string[];
  underlyingSymbols: string[];
  assets: SerializedFusePoolAsset[];
}

const ethMantissa = 1e18;
const blocksPerDay = 6570; // 13.15 seconds per block
const daysPerYear = 365;

export async function getPools(
  provider: ethers.providers.Provider,
  chainId: number
): Promise<Omit<FusePool, "assets">[]> {
  const fusePoolLens: FusePoolLens = FusePoolLens__factory.connect(
    addresses[chainId].fusePoolLens,
    provider
  );
  const publicPoolsWithData =
    await fusePoolLens.callStatic.getPublicPoolsWithData();
  return publicPoolsWithData[1].map((pool, index) => ({
    name: pool[0],
    comptroller: pool[2],
    totalSupply: publicPoolsWithData[2][index],
    totalBorrow: publicPoolsWithData[3][index],
    underlyingTokens: publicPoolsWithData[4][index],
    underlyingSymbols: publicPoolsWithData[5][index],
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

    console.log("debug pool data:")

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

export async function getFuseState(
  provider: ethers.providers.Provider,
  chainId: number
): Promise<{ pools: FusePool[] }> {
  const pools: Omit<FusePool, "assets">[] = await getPools(provider, chainId);
  const poolAssets: FusePoolAsset[][] = await getPoolAssets(
    provider,
    chainId,
    pools
  );
  return {
    pools: pools.map((pool, index) => ({ ...pool, assets: poolAssets[index] })),
  };
}

export function deserializeFuseState(state: { pools: SerializedFusePool[] }): {
  pools: FusePool[];
} {
  return {
    pools: state.pools.map((pool) => ({
      name: pool.name,
      comptroller: pool.comptroller,
      totalSupply: BigNumber.from(pool.totalSupply),
      totalBorrow: BigNumber.from(pool.totalBorrow),
      underlyingTokens: pool.underlyingTokens,
      underlyingSymbols: pool.underlyingSymbols,
      assets: pool.assets.map((asset) => ({
        cToken: asset.cToken,
        underlyingToken: asset.underlyingToken,
        underlyingName: asset.underlyingName,
        underlyingSymbol: asset.underlyingSymbol,
        underlyingDecimals: BigNumber.from(asset.underlyingDecimals),
        underlyingBalance: BigNumber.from(asset.underlyingBalance),
        supplyRatePerBlock: BigNumber.from(asset.supplyRatePerBlock),
        borrowRatePerBlock: BigNumber.from(asset.borrowRatePerBlock),
        totalSupply: BigNumber.from(asset.totalSupply),
        totalBorrow: BigNumber.from(asset.totalBorrow),
        supplyBalance: BigNumber.from(asset.supplyBalance),
        borrowBalance: BigNumber.from(asset.borrowBalance),
        liquidity: BigNumber.from(asset.liquidity),
        membership: asset.membership,
        exchangeRate: BigNumber.from(asset.exchangeRate),
        underlyingPrice: BigNumber.from(asset.underlyingPrice),
        oracle: asset.oracle,
        collateralFactor: BigNumber.from(asset.collateralFactor),
        reserveFactor: BigNumber.from(asset.reserveFactor),
        adminFee: BigNumber.from(asset.adminFee),
        fuseFee: BigNumber.from(asset.fuseFee),
      })),
    })),
  };
}

export function serializeFuseState(state: { pools: FusePool[] }): {
  pools: SerializedFusePool[];
} {
  return {
    pools: state.pools.map((pool) => ({
      name: pool.name,
      comptroller: pool.comptroller,
      totalSupply: pool.totalSupply.toString(),
      totalBorrow: pool.totalBorrow.toString(),
      underlyingTokens: pool.underlyingTokens,
      underlyingSymbols: pool.underlyingSymbols,
      assets: pool.assets.map((asset) => ({
        cToken: asset.cToken,
        underlyingToken: asset.underlyingToken,
        underlyingName: asset.underlyingName,
        underlyingSymbol: asset.underlyingSymbol,
        underlyingDecimals: asset.underlyingDecimals.toString(),
        underlyingBalance: asset.underlyingBalance.toString(),
        supplyRatePerBlock: asset.supplyRatePerBlock.toString(),
        borrowRatePerBlock: asset.borrowRatePerBlock.toString(),
        totalSupply: asset.totalSupply.toString(),
        totalBorrow: asset.totalBorrow.toString(),
        supplyBalance: asset.supplyBalance.toString(),
        borrowBalance: asset.borrowBalance.toString(),
        liquidity: asset.liquidity.toString(),
        membership: asset.membership,
        exchangeRate: asset.exchangeRate.toString(),
        underlyingPrice: asset.underlyingPrice.toString(),
        oracle: asset.oracle,
        collateralFactor: asset.collateralFactor.toString(),
        reserveFactor: asset.reserveFactor.toString(),
        adminFee: asset.adminFee.toString(),
        fuseFee: asset.fuseFee.toString(),
      })),
    })),
  };
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
