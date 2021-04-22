import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Box, Spinner, Center } from "@chakra-ui/react";
import getFuseData, { FuseData } from "../../utils/getFuseData";
import Selection from "./Selection";

function Home({
  provider,
}: {
  provider: ethers.providers.Web3Provider | undefined;
}): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [fuseData, setFuseData] = useState<FuseData[]>([]);
  const [currentPool, setCurrentPool] = useState<number>(3);

  useEffect(() => {
    const fetchData = async () => {
      const fetchFuseData: FuseData[] = await getFuseData(provider);
      setFuseData(fetchFuseData);
      setLoading(false);
    };
    fetchData();
  }, [provider]);

  return (
    <Box p={2}>
      {!loading ? (
        <Selection
          fuseData={fuseData}
          currentPool={currentPool}
          setCurrentPool={setCurrentPool}
        />
      ) : (
        <Center marginTop={10}>
          <Spinner size="xl" />
        </Center>
      )}
    </Box>
  );
}

export default Home;
