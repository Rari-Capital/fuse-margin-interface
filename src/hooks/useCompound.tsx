import { createContext, useContext, Context, ReactNode } from "react";
import useWeb3React from "./useWeb3React";
import useCompoundState, { initialState, State } from "./useCompoundState";

const CompoundContext: Context<State> = createContext<State>(initialState);

function useCompound(): State {
  return useContext(CompoundContext);
}

export function CompoundProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { provider, chainId } = useWeb3React();
  const compoundState = useCompoundState(provider, chainId);
  return (
    <CompoundContext.Provider value={compoundState}>
      {children}
    </CompoundContext.Provider>
  );
}

export type { State };
export default useCompound;
