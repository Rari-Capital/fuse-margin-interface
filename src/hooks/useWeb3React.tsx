import { createContext, useContext, Context, ReactNode } from "react";
import useWeb3ReactState, {
  initialData,
  Web3ReactData,
} from "./useWeb3ReactState";

const Web3Context: Context<Web3ReactData> =
  createContext<Web3ReactData>(initialData);

function useWeb3React(): Web3ReactData {
  return useContext(Web3Context);
}

export function Web3ReactProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const web3ModalValue = useWeb3ReactState();
  return (
    <Web3Context.Provider value={web3ModalValue}>
      {children}
    </Web3Context.Provider>
  );
}

export type { Web3ReactData } from "./useWeb3ReactState";
export default useWeb3React;
