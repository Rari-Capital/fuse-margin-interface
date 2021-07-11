import type { AppProps } from "next/app";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "../hooks/useWeb3React";
import { CompoundProvider } from "../hooks/useCompound";
import { BalancesProvider } from "../hooks/useBalances";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "white",
        color: "green.500",
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Web3ReactProvider>
      <CompoundProvider>
        <BalancesProvider>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </BalancesProvider>
      </CompoundProvider>
    </Web3ReactProvider>
  );
}
export default MyApp;
