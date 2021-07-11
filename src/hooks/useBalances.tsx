import { createContext, useContext, Context, ReactNode } from "react";
import useWeb3React from "./useWeb3React";
import useCompound from "./useCompound";
import useBalancesState, { initialState, State } from "./useBalancesState";

const BalancesContext: Context<State> = createContext<State>(initialState);

function useBalances(): State {
  return useContext(BalancesContext);
}

export function BalancesProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { provider, chainId, address } = useWeb3React();
  const compoundState = useCompound();
  const balancesState = useBalancesState(
    provider,
    chainId,
    address,
    compoundState
  );
  return (
    <BalancesContext.Provider value={balancesState}>
      {children}
    </BalancesContext.Provider>
  );
}

export type { State };
export default useBalances;
