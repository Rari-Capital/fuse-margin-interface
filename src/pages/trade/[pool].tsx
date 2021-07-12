import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Box, Text, Select, Center } from "@chakra-ui/react";
import Layout from "../../components/layout";
import Loading from "../../components/Loading";
import { SelectPool } from "../../components/Trade";
import useFuse from "../../hooks/useFuse";

function Trade(): JSX.Element {
  const router = useRouter();
  const { pools } = useFuse();
  const pool: number = router.query.pool ? Number(router.query.pool) : 0;
  const [token, setToken] = useState<number>(0);

  const setPool: (value: number) => void = useCallback(
    (value: number) => {
      setToken(0);
      router.push(`/trade/${value}`);
    },
    [router, setToken]
  );

  const tokens = pools[pool]
    ? pools[pool].assets.map((asset) => asset.underlyingSymbol)
    : [];
  const listItems = tokens.map((token, index) => (
    <option key={token} value={index}>
      {token}
    </option>
  ));

  return (
    <Layout>
      <Box p={2}>
        <Loading>
          {pool < pools.length ? (
            <>
              <SelectPool fusePools={pools} pool={pool} setPool={setPool} />
              <Center>
                <Select
                  value={token}
                  margin={1}
                  onChange={(event) => setToken(Number(event.target.value))}
                  maxW={100}
                  size="md"
                  color="black"
                  bg="white"
                >
                  {listItems}
                </Select>
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
