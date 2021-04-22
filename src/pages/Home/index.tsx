import { useEffect } from "react";
import { ethers } from "ethers";
import {
  FusePoolDirectory__factory,
  FusePoolDirectory,
} from "../../contracts/types";
import { Box } from "@chakra-ui/react";
import { fusePoolDirectoryAddress } from "../../constants";

function Home({
  provider,
}: {
  provider: ethers.providers.Web3Provider | undefined;
}): JSX.Element {
  useEffect(() => {
    if (provider) {
      const fetchData = async () => {
        const fusePoolDirectory: FusePoolDirectory = await FusePoolDirectory__factory.connect(
          fusePoolDirectoryAddress,
          provider.getSigner()
        );
        console.log(await fusePoolDirectory.getPublicPools());
      };
      fetchData();
    }
  }, [provider]);
  return (
    <Box>
      <p>Home</p>
    </Box>
  );
}

export default Home;
