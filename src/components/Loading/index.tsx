import { ReactNode } from "react";
import { Box, Text, Center, Spinner } from "@chakra-ui/react";
import useWeb3React from "../../hooks/useWeb3React";
import useFuse from "../../hooks/useFuse";
import { addresses } from "../../constants";

function Loading({ children }: { children?: ReactNode }): JSX.Element {
  const { provider, chainId } = useWeb3React();
  const fuseState = useFuse();

  return (
    <Box>
      {chainId in addresses ? (
        fuseState.loaded ? (
          children
        ) : fuseState.error ? (
          provider !== undefined ? (
            <Text>Failed to load data.</Text>
          ) : (
            <Text>Please connect your wallet.</Text>
          )
        ) : (
          <Center marginTop={2}>
            <Spinner size={"lg"} />
          </Center>
        )
      ) : (
        <Text>
          You are connected to the wrong chain. Please switch to mainnet.
        </Text>
      )}
    </Box>
  );
}

export default Loading;
