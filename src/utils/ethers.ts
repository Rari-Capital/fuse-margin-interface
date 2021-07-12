import { ethers } from "ethers";
import { ALCHEMY_API } from "../constants";

export function getDefaultProvider(
  chainId: number = 1
): ethers.providers.BaseProvider {
  if (chainId === 1) {
    return ethers.getDefaultProvider(ALCHEMY_API);
  } else {
    return ethers.getDefaultProvider(ALCHEMY_API);
  }
}
