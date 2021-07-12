import { ethers, BigNumber } from "ethers";
import { Call, Multicall__factory, Multicall, ERC20__factory } from "../types";
import { addresses } from "../constants";

export async function getBalances(
  provider: ethers.providers.Provider,
  chainId: number,
  address: string,
  tokens: string[]
): Promise<{
  balanceOf: BigNumber[];
}> {
  const multicall: Multicall = Multicall__factory.connect(
    addresses[chainId].multicall,
    provider
  );

  const etherIndexes: number[] = [];
  const tokenAddresses: string[] = tokens.filter((value, index) => {
    const filter = value !== ethers.constants.AddressZero;
    if (!filter) {
      etherIndexes.push(index);
    }
    return filter;
  });

  const balanceOfCalls: Call[] = tokenAddresses.map((token: string) => ({
    target: token,
    callData: ERC20__factory.createInterface().encodeFunctionData("balanceOf", [
      address,
    ]),
  }));

  const [balanceOfReturnData]: [string[]] = (
    await Promise.all([multicall.callStatic.aggregate(balanceOfCalls)])
  ).map(
    (aggregateReturn: {
      blockNumber: ethers.BigNumber;
      returnData: string[];
    }) => aggregateReturn.returnData
  ) as [string[]];

  let balanceOf: BigNumber[] = balanceOfReturnData.map((returnData: string) => {
    const decoded = ERC20__factory.createInterface().decodeFunctionResult(
      "balanceOf",
      returnData
    );
    return decoded[0] as BigNumber;
  });

  etherIndexes.forEach((value) => {
    balanceOf = [
      ...balanceOf.slice(0, value),
      BigNumber.from("0"),
      ...balanceOf.slice(value),
    ];
  });

  return {
    balanceOf,
  };
}

export async function getAllowances(
  provider: ethers.providers.Provider,
  chainId: number,
  address: string,
  tokens: string[],
  contract: string
): Promise<{
  allowance: BigNumber[];
}> {
  const multicall: Multicall = Multicall__factory.connect(
    addresses[chainId].multicall,
    provider
  );

  const etherIndexes: number[] = [];
  const tokenAddresses: string[] = tokens.filter((value, index) => {
    const filter = value !== ethers.constants.AddressZero;
    if (!filter) {
      etherIndexes.push(index);
    }
    return filter;
  });

  const allowanceCalls: Call[] = tokenAddresses.map((token: string) => ({
    target: token,
    callData: ERC20__factory.createInterface().encodeFunctionData("allowance", [
      address,
      contract,
    ]),
  }));

  const [allowanceReturnData]: [string[]] = (
    await Promise.all([multicall.callStatic.aggregate(allowanceCalls)])
  ).map(
    (aggregateReturn: {
      blockNumber: ethers.BigNumber;
      returnData: string[];
    }) => aggregateReturn.returnData
  ) as [string[]];

  let allowance: BigNumber[] = allowanceReturnData.map((returnData: string) => {
    const decoded = ERC20__factory.createInterface().decodeFunctionResult(
      "allowance",
      returnData
    );
    return decoded[0] as BigNumber;
  });

  etherIndexes.forEach((value) => {
    allowance = [
      ...allowance.slice(0, value),
      BigNumber.from("0"),
      ...allowance.slice(value),
    ];
  });

  return {
    allowance,
  };
}
