import Head from "next/head";
import { Box } from "@chakra-ui/react";
import { siteURL } from "../constants";
import { Header, ExternalLink } from "../components/Header";
import Layout from "../components/layout";
import Loading from "../components/Loading";
import { AccordionPools } from "../components/Home";
import useFuse from "../hooks/useFuse";

const pageTitle: string = "InstaLev - Margin Trade on Fuse";
const pageDescription: string =
  "Margin trade on Fuse. Open leveraged longs/shorts on any asset";
const pageURL: string = siteURL;

function Home(): JSX.Element {
  const { pools } = useFuse();

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={pageURL} />
        <meta property="og:description" content={pageDescription} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:url" content={pageURL} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>
      <Box p={2}>
        <Header>
          Margin trade on{" "}
          <ExternalLink href={"https://app.rari.capital/fuse"} text={"Fuse"} />{" "}
          . Open leveraged longs/shorts on any asset.
        </Header>
        <Loading>
          <AccordionPools fusePools={pools} currentPools={[3, 6, 7, 8]} />
        </Loading>
      </Box>
    </Layout>
  );
}

export default Home;
