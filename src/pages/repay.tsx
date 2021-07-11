import Head from "next/head";
import { Box, Center, Text } from "@chakra-ui/react";
import { Header, ExternalLink } from "../components/Header";
import Layout from "../components/layout";
import { siteURL } from "../constants";
import Balances from "../components/Balances";
import Loading from "../components/Loading";

const pageTitle: string =
  "Compound Swaps - Repay debt with collateral on Compound";
const pageDescription: string =
  "Compound Swaps - Collateral swaps and swap & repay debt with collateral on Compound";
const pageURL: string = siteURL;

function Repay(): JSX.Element {
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
          Repay debt with collateral on{" "}
          <ExternalLink href={"https://compound.finance/"} text={"Compound"} />
        </Header>
        <Loading>
          <Center>
            <Text>Coming Soon</Text>
          </Center>
          <Balances />
        </Loading>
      </Box>
    </Layout>
  );
}

export default Repay;
