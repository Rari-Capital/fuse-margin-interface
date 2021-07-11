import { useCallback } from "react";
import { useRouter } from "next/router";
import { Box, Text } from "@chakra-ui/react";
import Layout from "../../components/layout";
import Loading from "../../components/Loading";
import { SelectPool } from "../../components/Trade";
import useFuse from "../../hooks/useFuse";

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
