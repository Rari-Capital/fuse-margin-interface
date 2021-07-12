import { ethers } from "ethers";

export const GA_TRACKING_ID: string = process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? "";
export const siteURL: string = "https://instalev.finance/";
export const siteTitle: string = "InstaLev - Margin Trade on Fuse";
export const siteDescription: string =
  "Margin trade on Fuse. Open leveraged longs/shorts on any asset";
export const ALCHEMY_API: string = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
export const INFURA_ID: string = process.env.NEXT_PUBLIC_INFURA_ID ?? "";
export const saiSymbol: string =
  "0x4441490000000000000000000000000000000000000000000000000000000000";
export const mkrSymbol: string =
  "0x4d4b520000000000000000000000000000000000000000000000000000000000";
export const tradeEthAddress: string =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const addresses: {
  [chainId: number]: {
    multicall: string;
    wethAddress: string;
    daiAddress: string;
    uniswapV3FactoryAddress: string;
    fusePoolDirectory: string;
    fusePoolLens: string;
    fuseMarginController: string;
    fuseMarginV1: string;
    connectorV1: string;
  };
} = {
  1: {
    multicall: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
    wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    daiAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    uniswapV3FactoryAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    fusePoolDirectory: "0x835482FE0532f169024d5E9410199369aAD5C77E",
    fusePoolLens: "0x8dA38681826f4ABBe089643D2B3fE4C6e4730493",
    fuseMarginController: ethers.constants.AddressZero,
    fuseMarginV1: ethers.constants.AddressZero,
    connectorV1: ethers.constants.AddressZero,
  },
  1337: {
    multicall: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
    wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    daiAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    uniswapV3FactoryAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    fusePoolDirectory: "0x835482FE0532f169024d5E9410199369aAD5C77E",
    fusePoolLens: "0x8dA38681826f4ABBe089643D2B3fE4C6e4730493",
    fuseMarginController: ethers.constants.AddressZero,
    fuseMarginV1: ethers.constants.AddressZero,
    connectorV1: ethers.constants.AddressZero,
  },
};
