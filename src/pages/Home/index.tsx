import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Box,
  Spinner,
  Center,
  Heading,
  Link,
  Text,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
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
      <Center>
        <Heading as="h1" size="lg" margin={1} marginBottom={7}>
          Open leveraged longs/shorts on any asset. Built on{" "}
          <Link href="https://app.rari.capital/fuse" isExternal>
            <Text as="u">Fuse</Text>
          </Link>
          .
        </Heading>
      </Center>
      {!loading ? (
        <>
          <Selection
            fuseData={fuseData}
            currentPool={currentPool}
            setCurrentPool={setCurrentPool}
          />
          <Box marginTop={2}>Pool assets:</Box>
          <UnorderedList>
            {fuseData[currentPool].tokens.map((token) => (
              <ListItem>{token}</ListItem>
            ))}
          </UnorderedList>
        </>
      ) : (
        <>
          <Center marginTop={10}>
            <Spinner size="xl" />
          </Center>
          <Center marginTop={10}>
            <Box>Loading Fuse pools...</Box>
          </Center>
        </>
      )}
    </Box>
  );
}

export default Home;
