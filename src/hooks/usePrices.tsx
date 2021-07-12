import {
  useEffect,
  useState,
  createContext,
  useContext,
  Context,
  ReactNode,
  useCallback,
} from "react";
import { ethers } from "ethers";
import axios, { AxiosResponse } from "axios";
import useWeb3React from "./useWeb3React";
import useRequest from "./useRequest";
import { getCoinGeckoAssetPlatform } from "../utils";

export interface CoinGecko {
  image: {
    large: string;
    small: string;
    thumb: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
  };
}

export interface CoinGeckoMarketChart {
  prices: [number, number][];
}

export interface State {
  etherPrice: number;
  fetchCoinGecko: (address: string) => Promise<CoinGecko>;
  fetchCoinGeckoMarketChart: (
    address: string,
    days?: string
  ) => Promise<CoinGeckoMarketChart>;
}

const initialCoinGecko: CoinGecko = {
  image: {
    large: "",
    small: "",
    thumb: "",
  },
  market_data: {
    current_price: {
      usd: 0,
    },
  },
};

const initialCoinGeckoMarketChart: CoinGeckoMarketChart = {
  prices: [],
};

const initialState: State = {
  etherPrice: 0,
  fetchCoinGecko: async (address: string) => initialCoinGecko,
  fetchCoinGeckoMarketChart: async (address: string) =>
    initialCoinGeckoMarketChart,
};

const PricesContext: Context<State> = createContext<State>(initialState);

function usePrices(): State {
  return useContext(PricesContext);
}

export function PricesProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { chainId } = useWeb3React();
  const { cancellableRequest: cancellableRequest0 } = useRequest(false);
  const { cancellableRequest: cancellableRequest1 } = useRequest(false);
  const [etherPrice, setEtherPrice] = useState<number>(0);

  useEffect(() => {
    let isMounted: boolean = true;
    const fetchData = async () => {
      try {
        const res: AxiosResponse<any> = await axios(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const price: { [key: string]: { [key: string]: number } } | undefined =
          res.data;
        if (price && price.ethereum && price.ethereum.usd) {
          setEtherPrice(price.ethereum.usd);
        } else {
          console.log("Fetching prices failed");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchCoinGecko: (address: string) => Promise<CoinGecko> = useCallback(
    async (address: string) => {
      const assetPlatform: string = getCoinGeckoAssetPlatform(chainId);
      const url: string =
        address !== ethers.constants.AddressZero
          ? `https://api.coingecko.com/api/v3/coins/${assetPlatform}/contract/${address}`
          : `https://api.coingecko.com/api/v3/coins/ethereum`;
      const fetchedCoinGecko: CoinGecko | undefined = await cancellableRequest0(
        url
      );
      const coinGecko: CoinGecko = { ...initialCoinGecko };
      if (fetchedCoinGecko) {
        if (fetchedCoinGecko.image) {
          if (fetchedCoinGecko.image.large) {
            coinGecko.image.large = fetchedCoinGecko.image.large;
          }
          if (fetchedCoinGecko.image.small) {
            coinGecko.image.small = fetchedCoinGecko.image.small;
          }
          if (fetchedCoinGecko.image.thumb) {
            coinGecko.image.thumb = fetchedCoinGecko.image.thumb;
          }
        }
        if (
          fetchedCoinGecko.market_data &&
          fetchedCoinGecko.market_data.current_price &&
          fetchedCoinGecko.market_data.current_price.usd
        ) {
          coinGecko.market_data.current_price.usd =
            fetchedCoinGecko.market_data.current_price.usd;
        }
      }
      return coinGecko;
    },
    [chainId, cancellableRequest0]
  );

  const fetchCoinGeckoMarketChart: (
    address: string,
    days?: string
  ) => Promise<CoinGeckoMarketChart> = useCallback(
    async (address: string, days: string = "max") => {
      const assetPlatform: string = getCoinGeckoAssetPlatform(chainId);
      const url: string =
        address !== ethers.constants.AddressZero
          ? `https://api.coingecko.com/api/v3/coins/${assetPlatform}/contract/${address}/market_chart/?vs_currency=usd&days=${days}`
          : `https://api.coingecko.com/api/v3/coins/ethereum/market_chart/?vs_currency=usd&days=${days}`;
      const fetchedCoinGeckoMarketChart: CoinGeckoMarketChart | undefined =
        await cancellableRequest1(url);
      const coinGeckoMarketChart: CoinGeckoMarketChart = {
        ...initialCoinGeckoMarketChart,
      };
      if (fetchedCoinGeckoMarketChart && fetchedCoinGeckoMarketChart.prices) {
        coinGeckoMarketChart.prices = fetchedCoinGeckoMarketChart.prices;
      }
      return coinGeckoMarketChart;
    },
    [chainId, cancellableRequest1]
  );

  return (
    <PricesContext.Provider
      value={{ etherPrice, fetchCoinGecko, fetchCoinGeckoMarketChart }}
    >
      {children}
    </PricesContext.Provider>
  );
}

export default usePrices;
