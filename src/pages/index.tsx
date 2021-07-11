import { Box } from "@chakra-ui/react";
import { Header, ExternalLink } from "../components/Header";
import Layout from "../components/layout";
import Loading from "../components/Loading";
import { AccordionPools } from "../components/Home";
import useFuse from "../hooks/useFuse";

function Home(): JSX.Element {
  const { pools } = useFuse();

  return (
    <Layout>
      <Box p={2}>
        <Header>
          Margin trade on{" "}
          <ExternalLink href={"https://app.rari.capital/fuse"} text={"Fuse"} />.
          Open leveraged longs/shorts on any asset.
        </Header>
        <Loading>
          <AccordionPools fusePools={pools} currentPools={[3, 6, 7, 8]} />
        </Loading>
      </Box>
    </Layout>
  );
}

export default Home;
