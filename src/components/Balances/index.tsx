import { Box, Flex, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import CollateralSwitch from "./CollateralSwitch";
import useCompound from "../../hooks/useCompound";
import useBalances from "../../hooks/useBalances";
import { formatApy, formatBalance } from "../../utils";

function Balances(): JSX.Element {
  const compoundState = useCompound();
  const balancesState = useBalances();

  return (
    <Flex justify="center" items="center">
      <Box overflowY="auto" margin={1}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Token</Th>
              <Th>Collateral</Th>
              <Th isNumeric>Supply Balance</Th>
              <Th isNumeric>Supply APY</Th>
              <Th isNumeric>Borrow Balance</Th>
              <Th isNumeric>Borrow APY</Th>
            </Tr>
          </Thead>
          <Tbody>
            {compoundState.allMarkets.map(
              (allMarkets: string, index: number) => (
                <Tr key={allMarkets}>
                  <Td>{compoundState.symbol[index]}</Td>
                  <Td>
                    {compoundState.markets[
                      index
                    ].collateralFactorMantissa.toString() !== "0" && (
                      <CollateralSwitch
                        market={allMarkets}
                        balancesLoaded={balancesState.loaded}
                        assetIn={
                          balancesState.assetsIn[index] !== undefined
                            ? balancesState.assetsIn[index]
                            : false
                        }
                      />
                    )}
                  </Td>
                  <Td isNumeric>
                    {balancesState.loaded &&
                    balancesState.balanceOfUnderlying[index] &&
                    compoundState.decimals[index]
                      ? formatBalance(
                          balancesState.balanceOfUnderlying[index],
                          compoundState.decimals[index]
                        )
                      : "..."}
                  </Td>
                  <Td isNumeric>
                    {`${
                      compoundState.supplyRatePerBlock[index]
                        ? formatApy(compoundState.supplyRatePerBlock[index])
                        : "0"
                    }%`}
                  </Td>
                  <Td isNumeric>
                    {balancesState.loaded &&
                    balancesState.borrowBalanceCurrent[index] &&
                    compoundState.decimals[index]
                      ? formatBalance(
                          balancesState.borrowBalanceCurrent[index],
                          compoundState.decimals[index]
                        )
                      : "..."}
                  </Td>
                  <Td isNumeric>
                    {`${
                      compoundState.borrowRatePerBlock[index]
                        ? formatApy(compoundState.borrowRatePerBlock[index])
                        : "0"
                    }%`}
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}

export default Balances;
