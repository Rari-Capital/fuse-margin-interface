import {
  useEffect,
  useState,
  createContext,
  useContext,
  Context,
  ReactNode,
} from "react";
import axios, { AxiosResponse } from "axios";

export interface State {
  etherPrice: number;
}

const initialState: State = {
  etherPrice: 0,
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

  return (
    <PricesContext.Provider value={{ etherPrice }}>
      {children}
    </PricesContext.Provider>
  );
}

export default usePrices;
