import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Link,
  Image,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";
import NavLink from "./NavLink";
import WalletButton from "./WalletButton";

const Links: {
  link: string;
  url: string;
  external: boolean;
}[] = [
  { link: "Home", url: "/", external: false },
  {
    link: "Docs",
    url: "https://github.com/Rari-Capital/fuse-margin",
    external: true,
  },
  { link: "Fuse", url: "https://app.rari.capital/fuse", external: true },
];

export default function NavBar({
  provider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
}: {
  provider: ethers.providers.Web3Provider | undefined;
  loadWeb3Modal: CallableFunction;
  logoutOfWeb3Modal: CallableFunction;
}): JSX.Element {
  const {
    isOpen,
    onOpen,
    onClose,
  }: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  } = useDisclosure();

  return (
    <>
      <Box px={4}>
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
            <Link href="/">
              <HStack spacing={4} alignItems={"center"}>
                <Image borderRadius="full" src="fuseicon.png" alt="Fuse Logo" />
                <Box>
                  <Text as="b">Fuse Margin Trading</Text>
                </Box>
              </HStack>
            </Link>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink
                  key={link.link}
                  link={link.link}
                  url={link.url}
                  external={link.external}
                />
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <WalletButton
              provider={provider}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
            />
          </Flex>
        </Flex>
        {isOpen ? (
          <Box pb={4}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink
                  key={link.link}
                  link={link.link}
                  url={link.url}
                  external={link.external}
                />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
