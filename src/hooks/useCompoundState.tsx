import { useEffect, useRef, useReducer } from "react";
import { ethers, BigNumber } from "ethers";
import { Market } from "../types";
import {
  getCompoundAllMarkets,
  getCompoundMarkets,
  getTokens,
  getDefaultProvider,
} from "../utils";

export interface State {
  loaded: boolean;
  error: boolean;
  allMarkets: string[];
  markets: Market[];
  underlying: string[];
  borrowRatePerBlock: BigNumber[];
  supplyRatePerBlock: BigNumber[];
  symbol: string[];
  decimals: number[];
}

enum ActionType {
  FETCHED_DEFAULT,
  FETCHED_PROVIDER,
  SET_ERROR,
}

type Action =
  | {
      type: ActionType.FETCHED_DEFAULT;
      payload: Omit<State, "loaded" | "error">;
    }
  | {
      type: ActionType.FETCHED_PROVIDER;
      payload: Omit<State, "loaded" | "error">;
    }
  | {
      type: ActionType.SET_ERROR;
    };

export const initialState: State = {
  loaded: false,
  error: false,
  allMarkets: [],
  markets: [],
  underlying: [],
  borrowRatePerBlock: [],
  supplyRatePerBlock: [],
  symbol: [],
  decimals: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.FETCHED_DEFAULT: {
      const {
        allMarkets,
        markets,
        underlying,
        borrowRatePerBlock,
        supplyRatePerBlock,
        symbol,
        decimals,
      } = action.payload;
      if (state.loaded) {
        return { ...state };
      } else {
        return {
          ...state,
          loaded: true,
          error: false,
          allMarkets,
          markets,
          underlying,
          borrowRatePerBlock,
          supplyRatePerBlock,
          symbol,
          decimals,
        };
      }
    }
    case ActionType.FETCHED_PROVIDER: {
      const {
        allMarkets,
        markets,
        underlying,
        borrowRatePerBlock,
        supplyRatePerBlock,
        symbol,
        decimals,
      } = action.payload;
      return {
        ...state,
        loaded: true,
        error: false,
        allMarkets,
        markets,
        underlying,
        borrowRatePerBlock,
        supplyRatePerBlock,
        symbol,
        decimals,
      };
    }
    case ActionType.SET_ERROR: {
      if (state.loaded) {
        return { ...state };
      } else {
        return {
          ...state,
          error: true,
        };
      }
    }
    default:
      throw new Error();
  }
}

async function getCompoundState(
  provider: ethers.providers.Provider,
  chainId: number
): Promise<Omit<State, "loaded" | "error">> {
  const allMarkets: string[] = await getCompoundAllMarkets(provider, chainId);
  const { markets, underlying, borrowRatePerBlock, supplyRatePerBlock } =
    await getCompoundMarkets(provider, chainId, allMarkets);
  const { symbol, decimals } = await getTokens(provider, chainId, underlying);
  return {
    allMarkets,
    markets,
    underlying,
    borrowRatePerBlock,
    supplyRatePerBlock,
    symbol,
    decimals,
  };
}

function useCompoundState(
  provider: ethers.providers.Web3Provider | undefined,
  chainId: number
): State {
  const [state, dispatch] = useReducer<(state: State, action: Action) => State>(
    reducer,
    initialState
  );
  const mountedRef = useRef<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      mountedRef.current = true;
      try {
        if (provider) {
          const fetchCompoundState = await getCompoundState(provider, chainId);
          if (mountedRef.current) {
            dispatch({
              type: ActionType.FETCHED_PROVIDER,
              payload: fetchCompoundState,
            });
          }
        } else {
          const defaultProvider: ethers.providers.Provider =
            getDefaultProvider();
          const fetchCompoundState = await getCompoundState(
            defaultProvider,
            chainId
          );
          if (mountedRef.current) {
            dispatch({
              type: ActionType.FETCHED_DEFAULT,
              payload: fetchCompoundState,
            });
          }
        }
      } catch (err) {
        console.log(err);
        if (mountedRef.current) {
          dispatch({
            type: ActionType.SET_ERROR,
          });
        }
      }
    };
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [provider, chainId]);

  return state;
}

export default useCompoundState;
