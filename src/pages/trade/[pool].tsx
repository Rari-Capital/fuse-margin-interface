import { useCallback } from "react";
import { useRouter } from "next/router";
import { Box, Text } from "@chakra-ui/react";
import Layout from "../../components/layout";
import Loading from "../../components/Loading";
import { SelectPool } from "../../components/Trade";
import useFuse from "../../hooks/useFuse";
import useBalances from "../../hooks/useBalances";
import useAllowances from "../../hooks/useAllowances";

function Trade(): JSX.Element {
  const router = useRouter();
  const { pools } = useFuse();
  const pool: number = router.query.pool ? Number(router.query.pool) : 0;
  const { balances } = useBalances(pool);
  const { allowances } = useAllowances(
    pool,
    "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"
  );

  const setPool: (value: number) => void = useCallback(
    (value: number) => router.push(`/trade/${value}`),
    [router]
  );

  console.log(
    "Balances:",
    balances.map((balance) => balance.toString())
  );
  console.log(
    "Allowances:",
    allowances.map((allowance) => allowance.toString())
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
