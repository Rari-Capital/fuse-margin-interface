import { useState, useEffect } from "react";
import { Box, Spinner } from "@chakra-ui/react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import usePrices, { CoinGeckoMarketChart } from "../../hooks/usePrices";
import { FusePool, formatAmount } from "../../utils";

function PriceChart({
  pools,
  pool,
  token,
}: {
  pools: FusePool[];
  pool: number;
  token: number;
}): JSX.Element {
  const [marketChart, setMarketChart] = useState<CoinGeckoMarketChart>({
    prices: [],
  });
  const [loaded, setLoaded] = useState<boolean>(false);
  const { fetchCoinGeckoMarketChart } = usePrices();

  useEffect(() => {
    const tokenAddress: string = pools[pool]
      ? pools[pool].assets[token]
        ? pools[pool].assets[token].underlyingToken
        : ""
      : "";
    const fetchData = async () => {
      if (tokenAddress !== "") {
        setLoaded(false);
        const coinGeckomarketChart: CoinGeckoMarketChart =
          await fetchCoinGeckoMarketChart(tokenAddress, "30");
        setMarketChart(coinGeckomarketChart);
        setLoaded(true);
      }
    };
    fetchData();
  }, [pools, pool, token, fetchCoinGeckoMarketChart]);

  return (
    <Box>
      {loaded ? (
        marketChart.prices.length > 0 ? (
          <LineChart
            width={500}
            height={300}
            data={marketChart.prices}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={0}
              tickFormatter={(value) =>
                new Date(marketChart.prices[value][0])
                  .toISOString()
                  .split("T")[0]
              }
            />
            <YAxis />
            <Tooltip
              cursor={{ stroke: "white", strokeWidth: 2 }}
              formatter={(value: number) => `$${formatAmount(value)}`}
              contentStyle={{ backgroundColor: "black" }}
            />
            <Line type="linear" dataKey={1} stroke="#ffffff" dot={false} />
          </LineChart>
        ) : (
          <Box>No price data exists</Box>
        )
      ) : (
        <Spinner />
      )}
    </Box>
  );
}

export default PriceChart;
