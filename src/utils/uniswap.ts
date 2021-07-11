import { BigNumber, ethers, utils } from "ethers";
import uniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";
import { PoolKey } from "../types";
import { addresses } from "../constants";

export const POOL_BYTECODE_HASH = utils.keccak256(uniswapV3Pool.bytecode);
const feeDenominator: BigNumber = BigNumber.from("1000000");

export function calculateFee(amount: BigNumber, fee: BigNumber): BigNumber {
  const newAmount: BigNumber = amount
    .mul(feeDenominator)
    .div(feeDenominator.add(fee));
  return newAmount;
}

export function getAmounts(
  token: string,
  amount: BigNumber,
  poolKey: PoolKey
): {
  amount: BigNumber;
  amount0: BigNumber;
  amount1: BigNumber;
} {
  const fee: BigNumber = BigNumber.from(poolKey.fee);
  const newAmount: BigNumber = calculateFee(amount, fee);
  if (token === poolKey.token0) {
    return {
      amount: newAmount,
      amount0: newAmount,
      amount1: BigNumber.from("0"),
    };
  } else if (token === poolKey.token1) {
    return {
      amount: newAmount,
      amount0: BigNumber.from("0"),
      amount1: newAmount,
    };
  } else {
    throw new Error("token not in poolKey");
  }
}

export function compareToken(
  a: { address: string },
  b: { address: string }
): -1 | 1 {
  return a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1;
}

export function sortedTokens(
  a: { address: string },
  b: { address: string }
): [typeof a, typeof b] | [typeof b, typeof a] {
  return compareToken(a, b) < 0 ? [a, b] : [b, a];
}

export function computePoolAddress(
  factoryAddress: string,
  [tokenA, tokenB]: [string, string],
  fee: number
): string {
  const [token0, token1] =
    tokenA.toLowerCase() < tokenB.toLowerCase()
      ? [tokenA, tokenB]
      : [tokenB, tokenA];
  const constructorArgumentsEncoded = utils.defaultAbiCoder.encode(
    ["address", "address", "uint24"],
    [token0, token1, fee]
  );
  const create2Inputs = [
    "0xff",
    factoryAddress,
    // salt
    utils.keccak256(constructorArgumentsEncoded),
    // init code hash
    POOL_BYTECODE_HASH,
  ];
  const sanitizedInputs = `0x${create2Inputs.map((i) => i.slice(2)).join("")}`;
  return utils.getAddress(`0x${utils.keccak256(sanitizedInputs).slice(-40)}`);
}

export function getPoolKeyAndAddress(
  token: string,
  chainId: number
): { pool: string; poolKey: PoolKey } {
  const a: { address: string } = {
    address:
      token !== ethers.constants.AddressZero
        ? token
        : addresses[chainId].wethAddress,
  };
  const b: { address: string } = {
    address:
      token !== ethers.constants.AddressZero
        ? addresses[chainId].wethAddress
        : addresses[chainId].daiAddress,
  };
  const [token0, token1]: [{ address: string }, { address: string }] =
    sortedTokens(a, b);
  const poolKey: PoolKey = {
    token0: token0.address,
    token1: token1.address,
    fee: 3000,
  };
  const pool: string = computePoolAddress(
    addresses[chainId].uniswapV3FactoryAddress,
    [poolKey.token0, poolKey.token1],
    Number(poolKey.fee)
  );
  return { pool, poolKey };
}
