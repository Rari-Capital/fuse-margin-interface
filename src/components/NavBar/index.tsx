import { useCallback } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Link,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Image from "next/image";
import NextLink from "next/link";
import NavLink from "./NavLink";
import WalletButton from "./WalletButton";

const links: {
  link: string;
  url: string;
  external: boolean;
  isRoute: boolean;
}[] = [
  { link: "Home", url: "/", external: false, isRoute: true },
  { link: "Trade", url: "/trade", external: false, isRoute: true },
  {
    link: "Docs ↗",
    url: "https://github.com/Rari-Capital/fuse-margin",
    external: true,
    isRoute: false,
  },
  {
    link: "Fuse ↗",
    url: "https://app.rari.capital/fuse",
    external: true,
    isRoute: false,
  },
];

function NavBar(): JSX.Element {
  const router = useRouter();
  const {
    isOpen,
    onOpen,
    onClose,
  }: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  } = useDisclosure();

  const pathname: string = router.pathname;

  const isCurrent: (url: string) => boolean = useCallback(
    (url: string) =>
      url === "/" ? url === pathname : pathname.startsWith(url),
    [pathname]
  );

  return (
    <>
      <Box
        px={4}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={"gray.200"}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={
              isOpen ? (
                <CloseIcon color="black" />
              ) : (
                <HamburgerIcon color="black" />
              )
            }
            aria-label={"Open Menu"}
            display={{ md: !isOpen ? "none" : "inherit" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <NextLink href={"/"} passHref>
              <Link marginLeft={{ base: "1", md: "0" }}>
                <HStack spacing={4} alignItems={"center"}>
                  <Image
                    src="/logo.png"
                    alt="Compound Logo"
                    width={48}
                    height={48}
                  />
                  <Box>
                    <Text as="b" fontSize={{ base: "14px", lg: "16px" }}>
                      InstaLev
                    </Text>
                  </Box>
                </HStack>
              </Link>
            </NextLink>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {links.map((link) => (
                <NavLink
                  key={link.link}
                  link={link.link}
                  url={link.url}
                  external={link.external}
                  isRoute={link.isRoute}
                  isCurrent={isCurrent(link.url)}
                />
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <WalletButton />
          </Flex>
        </Flex>
        {isOpen ? (
          <Box pb={4}>
            <Stack as={"nav"} spacing={4}>
              {links.map((link) => (
                <NavLink
                  key={link.link}
                  link={link.link}
                  url={link.url}
                  external={link.external}
                  isRoute={link.isRoute}
                  isCurrent={isCurrent(link.url)}
                />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

export default NavBar;
