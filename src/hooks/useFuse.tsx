import {
  useEffect,
  useReducer,
  createContext,
  useContext,
  Context,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import axios, { AxiosResponse } from "axios";
import useWeb3React from "./useWeb3React";
import {
  getDefaultProvider,
  FusePool,
  getFuseState,
  deserializeFuseState,
  SerializedFusePool,
} from "../utils";

export interface State {
  loaded: boolean;
  error: boolean;
  pools: FusePool[];
}

enum ActionType {
  FETCHED_DEFAULT,
  SET_ERROR,
}

type Action =
  | {
      type: ActionType.FETCHED_DEFAULT;
      payload: Omit<State, "loaded" | "error">;
    }
  | {
      type: ActionType.SET_ERROR;
    };

const initialState: State = {
  loaded: false,
  error: false,
  pools: [],
};

const FuseContext: Context<State> = createContext<State>(initialState);

function useFuse(): State {
  return useContext(FuseContext);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.FETCHED_DEFAULT: {
      const { pools } = action.payload;
      return {
        ...state,
        loaded: true,
        error: false,
        pools,
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

export function FuseProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { chainId } = useWeb3React();
  const [state, dispatch] = useReducer<(state: State, action: Action) => State>(
    reducer,
    initialState
  );

  useEffect(() => {
    let isMounted: boolean = true;
    const fetchData = async () => {
      let pools: FusePool[] = [];
      try {
        const res: AxiosResponse<any> = await axios(
          `/api/fuse?chainId=${chainId}`
        );
        const fetchFuseState: { pools: SerializedFusePool[] } | undefined =
          res.data;
        if (fetchFuseState) {
          pools = deserializeFuseState(fetchFuseState).pools;
        }
      } catch (error) {
        console.log(error.message);
      }

      if (pools.length === 0) {
        try {
          const defaultProvider: ethers.providers.Provider =
            getDefaultProvider(chainId);
          const fetchFuseState = await getFuseState(defaultProvider, chainId);
          pools = fetchFuseState.pools;
        } catch (error) {
          console.log(error.message);
        }
      }

      if (isMounted && pools.length > 0) {
        dispatch({
          type: ActionType.FETCHED_DEFAULT,
          payload: { pools },
        });
      } else if (isMounted) {
        dispatch({
          type: ActionType.SET_ERROR,
        });
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [chainId]);

  return <FuseContext.Provider value={state}>{children}</FuseContext.Provider>;
}

export default useFuse;
