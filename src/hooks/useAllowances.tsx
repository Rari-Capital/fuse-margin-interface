import { useReducer, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import useWeb3React from "./useWeb3React";
import { getAllowances } from "../utils";

export interface State {
  loaded: boolean;
  error: boolean;
  allowances: BigNumber[];
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
  allowances: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.FETCHED_PROVIDER: {
      const { allowances } = action.payload;
      return {
        ...state,
        loaded: true,
        error: false,
        allowances,
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

function useAllowances(tokens: string[], contract: string): State {
  const { provider, chainId, address } = useWeb3React();
  const [state, dispatch] = useReducer<(state: State, action: Action) => State>(
    reducer,
    initialState
  );

  useEffect(() => {
    let isMounted: boolean = true;
    const fetchData = async () => {
      try {
        if (provider && address !== ethers.constants.AddressZero) {
          const allowancesState = await getAllowances(
            provider,
            chainId,
            address,
            tokens,
            contract
          );
          if (isMounted) {
            dispatch({
              type: ActionType.FETCHED_PROVIDER,
              payload: { allowances: allowancesState.allowance },
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
  }, [provider, chainId, address, JSON.stringify(tokens)]);

  return state;
}

export default useAllowances;
