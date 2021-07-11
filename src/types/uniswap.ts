import { BigNumberish } from "ethers";

export interface PoolKey {
  token0: string;
  token1: string;
  fee: BigNumberish;
}
