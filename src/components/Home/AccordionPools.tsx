import { Accordion } from "@chakra-ui/react";
import AccordionPool from "./AccordionPool";
import { FusePool } from "../../utils";

function AccordionFusePools({
  fusePools,
  currentPools,
}: {
  fusePools: FusePool[];
  currentPools: number[];
}): JSX.Element {
  const accordionItems = fusePools.map((fusePool, index) => (
    <AccordionPool
      key={fusePool.comptroller}
      fusePool={fusePool}
      index={index}
    />
  ));
  return (
    <Accordion defaultIndex={currentPools} allowMultiple>
      {accordionItems}
    </Accordion>
  );
}

export default AccordionFusePools;
