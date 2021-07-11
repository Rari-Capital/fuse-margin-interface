import Head from "next/head";
import { Box } from "@chakra-ui/react";
import { Header } from "../components/Header";
import Layout from "../components/layout";
import { siteURL } from "../constants";

const pageTitle: string = "InstaLev - 404 Page Not Found";
const pageDescription: string = "404 Page Not Found";
const pageURL: string = siteURL;

function Custom404(): JSX.Element {
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
        <Header>404 Page Not Found</Header>
      </Box>
    </Layout>
  );
}

export default Custom404;
