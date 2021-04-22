import { Link, useColorModeValue } from "@chakra-ui/react";

const NavLink = ({
  url,
  link,
  external,
}: {
  url: string;
  link: string;
  external: boolean;
}): JSX.Element => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      color: "black",
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={url}
    isExternal={external}
  >
    {link}
  </Link>
);

export default NavLink;
