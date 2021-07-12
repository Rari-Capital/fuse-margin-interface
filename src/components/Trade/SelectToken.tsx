import { Select } from "@chakra-ui/react";
import { FusePool } from "../../utils";

function SelectToken({
  pools,
  pool,
  token,
  setToken,
}: {
  pools: FusePool[];
  pool: number;
  token: number;
  setToken: (value: number) => void;
}): JSX.Element {
  const tokens = pools[pool]
    ? pools[pool].assets.map((asset) => asset.underlyingSymbol)
    : [];
  const listItems = tokens.map((token, index) => (
    <option key={token} value={index}>
      {token}
    </option>
  ));

  return (
    <Select
      value={token}
      onChange={(event) => setToken(Number(event.target.value))}
      maxW={150}
      size="md"
      color="black"
      bg="white"
    >
      {listItems}
    </Select>
  );
}

export default SelectToken;
