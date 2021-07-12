import { useReducer, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import useWeb3React from "./useWeb3React";
import useFuse from "./useFuse";
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

function useBalances(pool: number): State {
  const { provider, chainId, address } = useWeb3React();
  const { pools } = useFuse();
  const [state, dispatch] = useReducer<(state: State, action: Action) => State>(
    reducer,
    initialState
  );

  useEffect(() => {
    let isMounted: boolean = true;
    const fetchData = async () => {
      try {
        if (
          provider &&
          address !== ethers.constants.AddressZero &&
          pools[pool] &&
          pools[pool].assets.length > 0
        ) {
          const balancesState = await getBalances(
            provider,
            chainId,
            address,
            pools[pool].assets.map((asset) => asset.underlyingToken)
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
    if (provider !== undefined) provider.on("block", fetchData);
    return () => {
      isMounted = false;
      if (provider !== undefined) provider.off("block", fetchData);
    };
  }, [provider, chainId, address, pool, pools]);

  return state;
}

export default useBalances;
