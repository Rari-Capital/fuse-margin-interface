import { useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Text } from "@chakra-ui/react";
import { siteURL } from "../../constants";
import Layout from "../../components/layout";
import Loading from "../../components/Loading";
import { SelectPool } from "../../components/Trade";
import useFuse from "../../hooks/useFuse";

const pageTitle: string = "InstaLev - Margin Trade on Fuse";
const pageDescription: string =
  "Margin trade on Fuse. Open leveraged longs/shorts on any asset";
const pageURL: string = siteURL;

function Trade(): JSX.Element {
  const router = useRouter();
  const { pools } = useFuse();
  const pool: number = router.query.pool ? Number(router.query.pool) : 0;

  const setPool: (value: number) => void = useCallback(
    (value: number) => router.push(`/trade/${value}`),
    [router]
  );

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
        <Loading>
          {pool < pools.length ? (
            <SelectPool fusePools={pools} pool={pool} setPool={setPool} />
          ) : (
            <Text>Invalid pool.</Text>
          )}
        </Loading>
      </Box>
    </Layout>
  );
}

export default Trade;
