import { ethers } from "ethers";
import { networkAPI } from "../constants";

function getDefaultProvider(): ethers.providers.BaseProvider {
  return ethers.getDefaultProvider(networkAPI);
}

export default getDefaultProvider;
