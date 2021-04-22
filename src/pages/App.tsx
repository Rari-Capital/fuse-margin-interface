import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Box, Center } from "@chakra-ui/react";
import { ethers } from "ethers";
import useWeb3Modal from "../hooks/useWeb3Modal";
import NavBar from "../components/NavBar";
import Home from "./Home";

function App(): JSX.Element {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal]: [
    ethers.providers.Web3Provider | undefined,
    CallableFunction,
    CallableFunction
  ] = useWeb3Modal();

  return (
    <Router>
      <div>
        <Center>
          <Box w={1000}>
            <NavBar
              provider={provider}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
            />
            <Switch>
              <Route path="/">
                <Home provider={provider} />
              </Route>
            </Switch>
          </Box>
        </Center>
      </div>
    </Router>
  );
}

export default App;
