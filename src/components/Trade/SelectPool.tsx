import { Select } from "@chakra-ui/react";
import { FusePool } from "../../utils";

function SelectPool({
  fusePools,
  pool,
  setPool,
}: {
  fusePools: FusePool[];
  pool: number;
  setPool: (value: number) => void;
}): JSX.Element {
  const listItems = fusePools.map((data, index) => (
    <option key={data.comptroller} value={index}>
      {`${index} - ${data.name}`}
    </option>
  ));
  return (
    <Select
      value={pool}
      onChange={(event) => setPool(Number(event.target.value))}
      size="lg"
      color="black"
      bg="white"
    >
      {listItems}
    </Select>
  );
}

export default SelectPool;
