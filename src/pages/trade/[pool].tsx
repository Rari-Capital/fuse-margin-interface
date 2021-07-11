import Head from "next/head";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import { siteURL } from "../../constants";
import Layout from "../../components/layout";
import Loading from "../../components/Loading";

const pageTitle: string = "InstaLev - Margin Trade on Fuse";
const pageDescription: string =
  "Margin trade on Fuse. Open leveraged longs/shorts on any asset";
const pageURL: string = siteURL;

function Trade(): JSX.Element {
  const router = useRouter();
  const pool: number = router.query.pool ? Number(router.query.pool) : 0;

  console.log(pool);

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
        <Loading></Loading>
      </Box>
    </Layout>
  );
}

export default Trade;
