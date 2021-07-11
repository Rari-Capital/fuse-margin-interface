import {
  useEffect,
  useReducer,
  createContext,
  useContext,
  Context,
  ReactNode,
} from "react";
import useRequest from "./useRequest";

export interface State {
  loaded: boolean;
  error: boolean;
  price: number;
}

enum ActionType {
  FETCHED,
  SET_ERROR,
}

type Action =
  | {
      type: ActionType.FETCHED;
      payload: Omit<State, "loaded" | "error">;
    }
  | {
      type: ActionType.SET_ERROR;
    };

const initialState: State = {
  loaded: false,
  error: false,
  price: 0,
};

const EtherPriceContext: Context<State> = createContext<State>(initialState);

function useEtherPrice(): State {
  return useContext(EtherPriceContext);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.FETCHED: {
      const { price } = action.payload;
      return {
        ...state,
        loaded: true,
        error: false,
        price,
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

export function EtherPriceProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [state, dispatch] = useReducer<(state: State, action: Action) => State>(
    reducer,
    initialState
  );
  const { request } = useRequest();

  useEffect(() => {
    let isMounted: boolean = true;
    const fetchData = async () => {
      try {
        const price: { [key: string]: { [key: string]: number } } | undefined =
          await request(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
          );
        if (price && price.ethereum && price.ethereum.usd) {
          dispatch({
            type: ActionType.FETCHED,
            payload: { price: price.ethereum.usd },
          });
        }
      } catch (err) {
        console.log(err);
        if (isMounted) {
          dispatch({
            type: ActionType.SET_ERROR,
          });
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <EtherPriceContext.Provider value={state}>
      {children}
    </EtherPriceContext.Provider>
  );
}

export default useEtherPrice;
