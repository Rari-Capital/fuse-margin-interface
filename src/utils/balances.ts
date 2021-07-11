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
  fuseMarginV1Allowance: BigNumber[];
}> {
  const multicall: Multicall = Multicall__factory.connect(
    addresses[chainId].multicall,
    provider
  );

  const balanceOfCalls: Call[] = tokens.map((market: string) => ({
    target: market,
    callData: ERC20__factory.createInterface().encodeFunctionData("balanceOf", [
      address,
    ]),
  }));
  const fuseMarginV1AllowanceCalls: Call[] = tokens.map((market: string) => ({
    target: market,
    callData: ERC20__factory.createInterface().encodeFunctionData("allowance", [
      address,
      addresses[chainId].fuseMarginV1,
    ]),
  }));

  const [balanceOfReturnData, fuseMarginV1AllowanceReturnData]: [
    string[],
    string[]
  ] = (
    await Promise.all([
      multicall.callStatic.aggregate(balanceOfCalls),
      multicall.callStatic.aggregate(fuseMarginV1AllowanceCalls),
    ])
  ).map(
    (aggregateReturn: {
      blockNumber: ethers.BigNumber;
      returnData: string[];
    }) => aggregateReturn.returnData
  ) as [string[], string[]];

  const balanceOf: BigNumber[] = balanceOfReturnData.map(
    (returnData: string) => {
      const decoded = ERC20__factory.createInterface().decodeFunctionResult(
        "balanceOf",
        returnData
      );
      return decoded[0] as BigNumber;
    }
  );
  const fuseMarginV1Allowance: BigNumber[] =
    fuseMarginV1AllowanceReturnData.map((returnData: string) => {
      const decoded = ERC20__factory.createInterface().decodeFunctionResult(
        "allowance",
        returnData
      );
      return decoded[0] as BigNumber;
    });

  return {
    balanceOf,
    fuseMarginV1Allowance,
  };
}
