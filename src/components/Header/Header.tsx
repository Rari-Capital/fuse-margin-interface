import { ReactNode } from "react";
import { Heading, HeadingProps } from "@chakra-ui/react";

function Header({
  children,
  props,
}: {
  children: ReactNode;
  props?: HeadingProps;
}): JSX.Element {
  return (
    <Heading
      as="h1"
      fontSize="2xl"
      color="white"
      size="lg"
      margin={1}
      marginBottom={5}
      textAlign="center"
      {...props}
    >
      {children}
    </Heading>
  );
}

export default Header;
