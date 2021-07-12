import { useRef, useReducer, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import _ from "lodash";
import useWeb3React from "./useWeb3React";
import { getBalances } from "../utils";

export interface State {
  loaded: boolean;
  error: boolean;
  balances: BigNumber[];
}

enum ActionType {
  FETCHED_PROVIDER,
  SET_ERROR,
}

type Action =
  | {
      type: ActionType.FETCHED_PROVIDER;
      payload: Omit<State, "loaded" | "error">;
    }
  | {
      type: ActionType.SET_ERROR;
    };

const initialState: State = {
  loaded: false,
  error: false,
  balances: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.FETCHED_PROVIDER: {
      const { balances } = action.payload;
      return {
        ...state,
        loaded: true,
        error: false,
        balances,
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

function useBalances(tokens: string[]): State {
  const { provider, chainId, address } = useWeb3React();
  const [state, dispatch] = useReducer<(state: State, action: Action) => State>(
    reducer,
    initialState
  );
  const prevTokens = useRef<string[]>([]);

  useEffect(() => {
    if (!_.isEqual(prevTokens.current, tokens)) {
      prevTokens.current = tokens;
      let isMounted: boolean = true;
      const fetchData = async () => {
        try {
          if (provider && address !== ethers.constants.AddressZero) {
            const balancesState = await getBalances(
              provider,
              chainId,
              address,
              tokens
            );
            if (isMounted) {
              dispatch({
                type: ActionType.FETCHED_PROVIDER,
                payload: { balances: balancesState.balanceOf },
              });
            }
          }
        } catch (error) {
          console.log(error.message);
          if (isMounted) {
            dispatch({
              type: ActionType.SET_ERROR,
            });
          }
        }
      };
      fetchData();
      const listener = () => {
        fetchData();
      };
      if (provider !== undefined) provider.on("block", listener);
      return () => {
        isMounted = false;
        if (provider !== undefined) provider.off("block", listener);
      };
    }
  }, [provider, chainId, address, tokens]);

  return state;
}

export default useBalances;
