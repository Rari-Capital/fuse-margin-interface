import type { AppProps } from "next/app";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "../hooks/useWeb3React";
import { FuseProvider } from "../hooks/useFuse";
import { EtherPriceProvider } from "../hooks/useEtherPrice";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "black",
        color: "white",
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Web3ReactProvider>
      <FuseProvider>
        <EtherPriceProvider>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </EtherPriceProvider>
      </FuseProvider>
    </Web3ReactProvider>
  );
}
export default MyApp;
