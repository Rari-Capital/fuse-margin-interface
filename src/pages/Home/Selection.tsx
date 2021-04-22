import React from "react";
import { Select } from "@chakra-ui/react";
import { FuseData } from "../../utils/getFuseData";

function Selection({
  fuseData,
  currentPool,
  setCurrentPool,
}: {
  fuseData: FuseData[];
  currentPool: number;
  setCurrentPool: CallableFunction;
}): JSX.Element {
  const listItems = fuseData.map((data: FuseData, index: number) => (
    <option key={data.comptroller} value={index}>
      {data.name}
    </option>
  ));
  return (
    <Select
      value={currentPool}
      onChange={(event) => setCurrentPool(event.target.value)}
      size="lg"
    >
      {listItems}
    </Select>
  );
}

export default Selection;
