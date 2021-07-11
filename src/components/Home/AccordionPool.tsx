import NextLink from "next/link";
import {
  Box,
  Text,
  Button,
  Flex,
  Link,
  Spacer,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { FusePool } from "../../utils";

function AccordionPool({
  fusePool,
  index,
}: {
  fusePool: FusePool;
  index: number;
}): JSX.Element {
  const tokensList: string = fusePool.underlyingSymbols.join(" • ");
  return (
    <AccordionItem>
      <h2>
        <AccordionButton _expanded={{ bg: "white", color: "black" }}>
          <Box flex="1" textAlign="left">
            {`${index} - ${fusePool.name}`}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <NextLink href={`/trade/${index}`} passHref>
        <Link>
          <AccordionPanel
            bg="gray.800"
            _hover={{
              bg: "gray.700",
            }}
            pb={4}
          >
            <Flex>
              <Text>{tokensList}</Text>
              <Spacer />
              <Box marginLeft="2">
                <Button
                  color="purple"
                  rightIcon={<ArrowForwardIcon />}
                  bg="white"
                  _hover={{ textDecoration: "underline", bg: "gray.200" }}
                >
                  Trade
                </Button>
              </Box>
            </Flex>
          </AccordionPanel>
        </Link>
      </NextLink>
    </AccordionItem>
  );
}

export default AccordionPool;
