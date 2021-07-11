import { Switch } from "@chakra-ui/react";
import { Signer } from "ethers";
import useWeb3React from "../../hooks/useWeb3React";
import useTransaction from "../../hooks/useTransaction";
import { Comptroller__factory, Comptroller } from "../../types";
import { addresses } from "../../constants";

function CollateralSwitch({
  balancesLoaded,
  assetIn,
  market,
}: {
  balancesLoaded: boolean;
  assetIn: boolean;
  market: string;
}): JSX.Element {
  const { provider, chainId } = useWeb3React();
  const { sendTransaction } = useTransaction();

  const onChange = async () => {
    if (balancesLoaded && provider !== undefined) {
      const signer: Signer = await provider.getUncheckedSigner();
      const comptroller: Comptroller = Comptroller__factory.connect(
        addresses[chainId].comptroller,
        signer
      );
      if (assetIn) {
        await sendTransaction(comptroller.exitMarket(market));
      } else {
        await sendTransaction(comptroller.enterMarkets([market]));
      }
    }
  };

  return (
    <Switch
      colorScheme={"green"}
      isReadOnly={!balancesLoaded}
      isChecked={assetIn}
      onChange={onChange}
    />
  );
}

export default CollateralSwitch;
