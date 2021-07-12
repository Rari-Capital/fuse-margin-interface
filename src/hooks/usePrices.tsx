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

export interface State {
  etherPrice: number;
  fetchCoinGecko: (address: string) => Promise<CoinGecko>;
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

const initialState: State = {
  etherPrice: 0,
  fetchCoinGecko: async (address: string) => initialCoinGecko,
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
  const { request } = useRequest(false);
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
        console.log(await fetchCoinGecko(ethers.constants.AddressZero));
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
      const fetchedCoinGecko: CoinGecko | undefined = await request(url);
      if (fetchedCoinGecko) {
        const coinGecko: CoinGecko = { ...initialCoinGecko };
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
        return coinGecko;
      } else {
        return initialCoinGecko;
      }
    },
    [chainId, request]
  );

  return (
    <PricesContext.Provider value={{ etherPrice, fetchCoinGecko }}>
      {children}
    </PricesContext.Provider>
  );
}

export default usePrices;
