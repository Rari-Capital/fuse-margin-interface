import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Badge,
  Button,
  Select,
} from "@chakra-ui/react";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { ethers, BigNumber, Signer } from "ethers";
import useWeb3React from "../../hooks/useWeb3React";
import useCompound from "../../hooks/useCompound";
import useBalances from "../../hooks/useBalances";
import useTransaction from "../../hooks/useTransaction";
import WalletButton from "../NavBar/WalletButton";
import {
  ERC20,
  ERC20__factory,
  CTokenSwap,
  CTokenSwap__factory,
  Comptroller,
  Comptroller__factory,
} from "../../types";
import {
  formatBalance,
  formatApy,
  stripInputValue,
  wrappedGetCTokenAmount,
  getPoolKeyAndAddress,
  getAmounts,
} from "../../utils";
import { tradeEthAddress, addresses } from "../../constants";

const tokenOptions: (tokenSymbols: string[]) => JSX.Element[] = (
  tokenSymbols: string[]
) =>
  tokenSymbols.map((token: string, index: number) => (
    <option key={token} value={index}>
      {token}
    </option>
  ));

function Swap(): JSX.Element {
  const { provider, chainId } = useWeb3React();
  const { sendTransaction } = useTransaction();
  const compoundState = useCompound();
  const balancesState = useBalances();
  const [token0, setToken0] = useState<number>(0);
  const [token1, setToken1] = useState<number>(1);
  const [token0Input, setToken0Input] = useState<string>("0");
  const [token1Input, setToken1Input] = useState<string>("0");
  const [cToken0Amount, setCToken0Amount] = useState<BigNumber>(
    BigNumber.from("0")
  );

  const token0Address: string =
    compoundState.underlying[token0] ?? ethers.constants.AddressZero;
  const cToken0Address: string =
    compoundState.allMarkets[token0] ?? ethers.constants.AddressZero;
  const cToken0Balance: BigNumber =
    balancesState.balanceOf[token0] ?? BigNumber.from("0");
  const token0Balance: BigNumber =
    balancesState.balanceOfUnderlying[token0] ?? BigNumber.from("0");
  const token0Decimals: number = compoundState.decimals[token0] ?? 0;
  const cToken0Allowance: BigNumber =
    balancesState.cTokenSwapAllowance[token0] ?? BigNumber.from("0");
  const token1Address: string =
    compoundState.underlying[token1] ?? ethers.constants.AddressZero;
  const cToken1Address: string =
    compoundState.allMarkets[token1] ?? ethers.constants.AddressZero;
  // const cToken1Balance: BigNumber =
  //   balancesState.balanceOf[token1] ?? BigNumber.from("0");
  const token1Balance: BigNumber =
    balancesState.balanceOfUnderlying[token1] ?? BigNumber.from("0");
  const token1Decimals: number = compoundState.decimals[token1] ?? 0;
  const cToken1AssetIn: boolean = balancesState.assetsIn[token1] ?? false;
  const cToken1IsCollateral: boolean =
    compoundState.markets[token1].collateralFactorMantissa.toString() !== "0";

  const token0InputStripped: string = stripInputValue(token0Input);
  const token0InputBN: BigNumber = !(
    token0InputStripped.split(".")[1] &&
    token0InputStripped.split(".")[1].length > compoundState.decimals[token0]
  )
    ? ethers.utils.parseUnits(token0InputStripped, token0Decimals)
    : BigNumber.from("0");

  const shouldFlash: boolean = balancesState.borrowBalanceCurrent
    .reduce((accumulator, currentValue) => {
      return accumulator.add(currentValue);
    }, BigNumber.from("0"))
    .gt(BigNumber.from("0"));
  const isApproved: boolean = cToken0Allowance.gte(cToken0Amount);
  const isValid: boolean = token0InputBN.lte(token0Balance);
  const isMax: boolean = isValid && token0InputBN.gte(token0Balance);
  const isUsable: boolean = token0InputBN.gt(BigNumber.from("0"));

  const flipTokens = useCallback(() => {
    const tempToken0 = token0;
    setToken0(token1);
    setToken1(tempToken0);
  }, [token0, token1, setToken0, setToken1]);

  const setToken = useCallback(
    (token: number, isZero: boolean) => {
      if (token === token0 || token === token1) {
        flipTokens();
      } else if (isZero) {
        setToken0(token);
      } else {
        setToken1(token);
      }
    },
    [token0, token1, setToken0, setToken1, flipTokens]
  );

  const setMax = useCallback(() => {
    const inputValue: string = ethers.utils.formatUnits(
      token0Balance,
      token0Decimals
    );
    setToken0Input(inputValue);
  }, [token0Balance, token0Decimals, setToken0Input]);

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const trade = await fetch(
          `https://api.0x.org/swap/v1/quote?sellToken=${
            token0Address === ethers.constants.AddressZero
              ? tradeEthAddress
              : token0Address
          }&buyToken=${
            token1Address === ethers.constants.AddressZero
              ? tradeEthAddress
              : token1Address
          }&sellAmount=${token0InputBN.toString()}&slippagePercentage=1`
        ).then((r) => r.json());
        if (trade.buyAmount) {
          setToken1Input(
            ethers.utils.formatUnits(
              ethers.BigNumber.from(trade.buyAmount),
              token1Decimals
            )
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    const fetchCTokens = async () => {
      if (provider !== undefined) {
        const getCTokenAmount = await wrappedGetCTokenAmount(
          provider,
          cToken0Address,
          token0InputBN
        );
        if (getCTokenAmount.gt(cToken0Balance)) {
          setCToken0Amount(cToken0Balance);
        } else {
          setCToken0Amount(getCTokenAmount);
        }
      }
    };
    if (isUsable) {
      fetchTrade();
      fetchCTokens();
    } else {
      setToken1Input("0");
      setCToken0Amount(BigNumber.from("0"));
    }
  }, [token0, token1, token0Input, provider]);

  const enterMarket = useCallback(async (): Promise<void> => {
    if (!cToken1AssetIn && provider !== undefined) {
      const signer: Signer = await provider.getUncheckedSigner();
      const comptroller: Comptroller = Comptroller__factory.connect(
        addresses[chainId].comptroller,
        signer
      );
      await sendTransaction(comptroller.enterMarkets([cToken1Address]));
    }
  }, [cToken1AssetIn, provider, cToken1Address, chainId, sendTransaction]);

  const approveToken = useCallback(async (): Promise<void> => {
    if (isUsable && isValid && !isApproved && provider) {
      const signer: Signer = await provider.getUncheckedSigner();
      const cToken: ERC20 = ERC20__factory.connect(cToken0Address, signer);
      await sendTransaction(
        cToken.approve(
          addresses[chainId].cTokenSwap,
          cToken0Amount.mul(101).div(100)
        )
      );
    }
  }, [
    isUsable,
    isValid,
    isApproved,
    provider,
    cToken0Address,
    cToken0Amount,
    chainId,
    sendTransaction,
  ]);

  const swapToken = useCallback(async (): Promise<void> => {
    if (isApproved && isValid && isUsable && provider) {
      try {
        if (shouldFlash) {
          const flashAmount: BigNumber = cToken0Amount.eq(cToken0Balance)
            ? token0Balance
            : token0InputBN;
          const { pool, poolKey } = getPoolKeyAndAddress(
            token0Address,
            chainId
          );
          const { amount, amount0, amount1 } = getAmounts(
            token0Address !== ethers.constants.AddressZero
              ? token0Address
              : addresses[chainId].wethAddress,
            flashAmount,
            poolKey
          );
          const trade = await fetch(
            `https://api.0x.org/swap/v1/quote?sellToken=${
              token0Address === ethers.constants.AddressZero
                ? addresses[chainId].wethAddress
                : token0Address
            }&buyToken=${
              token1Address === ethers.constants.AddressZero
                ? tradeEthAddress
                : token1Address
            }&sellAmount=${amount.toString()}&excludedSources=Uniswap_V3&slippagePercentage=1`
          ).then((r) => r.json());
          if (trade.data && trade.to) {
            const signer: Signer = await provider.getUncheckedSigner();
            const cTokenSwap: CTokenSwap = CTokenSwap__factory.connect(
              addresses[chainId].cTokenSwap,
              signer
            );
            await sendTransaction(
              cTokenSwap.collateralSwapFlash(amount0, amount1, pool, poolKey, {
                token0Amount: amount,
                cToken0Amount: cToken0Amount,
                token0:
                  token0Address !== ethers.constants.AddressZero
                    ? token0Address
                    : addresses[chainId].wethAddress,
                token1: token1Address,
                cToken0: cToken0Address,
                cToken1: cToken1Address,
                exchange: trade.to as string,
                data: trade.data as string,
              })
            );
          }
        } else {
          const trade = await fetch(
            `https://api.0x.org/swap/v1/quote?sellToken=${
              token0Address === ethers.constants.AddressZero
                ? tradeEthAddress
                : token0Address
            }&buyToken=${
              token1Address === ethers.constants.AddressZero
                ? tradeEthAddress
                : token1Address
            }&sellAmount=${token0InputBN.toString()}&slippagePercentage=1`
          ).then((r) => r.json());
          if (trade.data && trade.to) {
            const signer: Signer = await provider.getUncheckedSigner();
            const cTokenSwap: CTokenSwap = CTokenSwap__factory.connect(
              addresses[chainId].cTokenSwap,
              signer
            );
            await sendTransaction(
              cTokenSwap.collateralSwap({
                token0Amount: token0InputBN,
                cToken0Amount: cToken0Amount,
                token0: token0Address,
                token1: token1Address,
                cToken0: cToken0Address,
                cToken1: cToken1Address,
                exchange: trade.to as string,
                data: trade.data as string,
              })
            );
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [
    shouldFlash,
    isApproved,
    isValid,
    isUsable,
    provider,
    token0Address,
    token1Address,
    token0InputBN,
    cToken0Amount,
    cToken0Address,
    cToken1Address,
    token0Balance,
    cToken0Balance,
    chainId,
    sendTransaction,
  ]);

  return (
    <Box>
      <Center marginBottom={1}>
        <Badge colorScheme="gray" marginRight={1}>
          {`Supply Balance: ${formatBalance(token0Balance, token0Decimals)}`}
        </Badge>
        <Badge colorScheme="gray" marginLeft={1}>
          {`Supply APY: ${
            compoundState.supplyRatePerBlock[token0]
              ? formatApy(compoundState.supplyRatePerBlock[token0])
              : "0"
          }%`}
        </Badge>
      </Center>
      <Center marginBottom={1}>
        <Box minW={{ base: 300, sm: 400 }} display={"flex"}>
          <Select
            maxW={100}
            value={token0}
            onChange={(event) => setToken(Number(event.target.value), true)}
            marginRight={1}
          >
            {tokenOptions(compoundState.symbol)}
          </Select>
          <InputGroup>
            <Input
              type="number"
              value={token0Input}
              onChange={(event) => setToken0Input(event.target.value)}
              isInvalid={!isValid}
              errorBorderColor="crimson"
              focusBorderColor={isValid ? "blue.500" : "crimson"}
            />
            <InputRightElement width="4rem">
              <Button
                onClick={setMax}
                h="1.75rem"
                size="sm"
                color={isMax ? "blue.500" : "green"}
              >
                Max
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Center>
      <Center marginTop={1} marginBottom={1}>
        <IconButton
          aria-label="Flip"
          onClick={flipTokens}
          rounded="md"
          icon={<ArrowDownIcon />}
        />
      </Center>
      <Center marginBottom={1} marginTop={1}>
        <Badge colorScheme="gray" marginRight={1}>
          {`Supply Balance: ${formatBalance(token1Balance, token1Decimals)}`}
        </Badge>
        <Badge colorScheme="gray" marginLeft={1}>
          {`Supply APY: ${
            compoundState.supplyRatePerBlock[token1]
              ? formatApy(compoundState.supplyRatePerBlock[token1])
              : "0"
          }%`}
        </Badge>
      </Center>
      <Center>
        <Box minW={{ base: 300, sm: 400 }} display={"flex"}>
          <Select
            maxW={100}
            value={token1}
            onChange={(event) => setToken(Number(event.target.value), false)}
            marginRight={1}
          >
            {tokenOptions(compoundState.symbol)}
          </Select>
          <InputGroup>
            <Input disabled type="number" isReadOnly value={token1Input} />
          </InputGroup>
        </Box>
      </Center>
      {provider !== undefined ? (
        shouldFlash ? (
          <Center marginTop={1}>
            <Button
              marginRight={1}
              disabled={cToken1AssetIn || !cToken1IsCollateral}
              onClick={enterMarket}
            >
              Enable Collateral
            </Button>
            <Button
              marginRight={1}
              marginLeft={1}
              disabled={
                isApproved ||
                !(cToken1IsCollateral && cToken1AssetIn && isValid && isUsable)
              }
              onClick={approveToken}
            >
              Approve
            </Button>
            <Button
              marginLeft={1}
              disabled={
                !(
                  cToken1IsCollateral &&
                  cToken1AssetIn &&
                  isApproved &&
                  isValid &&
                  isUsable
                )
              }
              onClick={swapToken}
            >
              Swap
            </Button>{" "}
          </Center>
        ) : (
          <Center marginTop={1}>
            <Button
              marginRight={1}
              marginLeft={1}
              disabled={isApproved || !(isValid && isUsable)}
              onClick={approveToken}
            >
              Approve
            </Button>
            <Button
              marginLeft={1}
              disabled={!(isApproved && isValid && isUsable)}
              onClick={swapToken}
            >
              Swap
            </Button>
          </Center>
        )
      ) : (
        <Center marginTop={1}>
          <WalletButton />
        </Center>
      )}
    </Box>
  );
}

export default Swap;
