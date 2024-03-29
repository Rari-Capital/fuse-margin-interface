import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Text, Center } from "@chakra-ui/react";
import Layout from "../../components/layout";
import Loading from "../../components/Loading";
import { SelectPool, SelectToken, PriceChart } from "../../components/Trade";
import useFuse from "../../hooks/useFuse";

function Trade(): JSX.Element {
  const router = useRouter();
  const { pools } = useFuse();
  const pool: number = router.query.pool ? Number(router.query.pool) : 0;
  const [token, setToken] = useState<number>(0);

  const setPool: (value: number) => void = useCallback(
    (value: number) => {
      router.push(`/trade/${value}`);
    },
    [router]
  );

  useEffect(() => {
    setToken((prevState) => {
      if (pools[pool] && prevState >= pools[pool].assets.length) {
        return 0;
      } else {
        return prevState;
      }
    });
  }, [pool, pools]);

  return (
    <Layout>
      <Box p={2}>
        <Loading>
          {pool < pools.length ? (
            <>
              <SelectPool pools={pools} pool={pool} setPool={setPool} />
              <Center margin={1}>
                <SelectToken
                  pools={pools}
                  pool={pool}
                  token={token}
                  setToken={setToken}
                />
              </Center>
              <Center margin={1}>
                <PriceChart pools={pools} pool={pool} token={token} />
              </Center>
            </>
          ) : (
            <Text>Invalid pool.</Text>
          )}
        </Loading>
      </Box>
    </Layout>
  );
}

export default Trade;
