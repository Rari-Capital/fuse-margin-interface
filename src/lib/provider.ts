import { ethers } from "ethers";

export const ALCHEMY_API: string = `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;

export function getDefaultProvider(
  chainId: number = 1
): ethers.providers.BaseProvider {
  if (chainId === 1) {
    return ethers.getDefaultProvider(ALCHEMY_API);
  } else {
    return ethers.getDefaultProvider(ALCHEMY_API);
  }
}
