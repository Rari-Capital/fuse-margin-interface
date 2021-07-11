import { ethers } from "ethers";
import { Call, Multicall__factory, Multicall, ERC20__factory } from "../types";
import { addresses, saiSymbol, mkrSymbol } from "../constants";

export async function getTokens(
  provider: ethers.providers.Provider,
  chainId: number,
  underlying: string[]
): Promise<{ symbol: string[]; decimals: number[] }> {
  const multicall: Multicall = Multicall__factory.connect(
    addresses[chainId].multicall,
    provider
  );

  const symbolCalls: Call[] = underlying.map((address: string) => ({
    target: address,
    callData: ERC20__factory.createInterface().encodeFunctionData("symbol"),
  }));
  const decimalsCalls: Call[] = underlying.map((address: string) => ({
    target: address,
    callData: ERC20__factory.createInterface().encodeFunctionData("decimals"),
  }));

  const [symbolReturnData, decimalsReturnData]: [string[], string[]] = (
    await Promise.all([
      multicall.callStatic.aggregate(symbolCalls),
      multicall.callStatic.aggregate(decimalsCalls),
    ])
  ).map(
    (aggregateReturn: {
      blockNumber: ethers.BigNumber;
      returnData: string[];
    }) => aggregateReturn.returnData
  ) as [string[], string[]];

  const symbol: string[] = symbolReturnData.map((returnData: string) => {
    if (returnData === "0x") {
      return "ETH";
    } else if (returnData === saiSymbol) {
      return "SAI";
    } else if (returnData === mkrSymbol) {
      return "MKR";
    } else {
      const decoded = ERC20__factory.createInterface().decodeFunctionResult(
        "symbol",
        returnData
      );
      return decoded[0] as string;
    }
  });
  const decimals: number[] = decimalsReturnData.map((returnData: string) => {
    if (returnData === "0x") {
      return 18;
    } else {
      const decoded = ERC20__factory.createInterface().decodeFunctionResult(
        "decimals",
        returnData
      );
      return decoded[0] as number;
    }
  });

  return { symbol, decimals };
}
