import { BigNumber } from "ethers";

export interface Market {
  isListed: boolean;
  collateralFactorMantissa: BigNumber;
  isComped: boolean;
}
