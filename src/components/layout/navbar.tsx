import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { MdLogout } from "react-icons/md";
import { Logo } from "./logo";

export const Navbar = () => {
  const { data: session } = useSession();

  const { user } = session ?? {};

  const { asPath } = useRouter();

  const bgStyle: { [key: string]: string } = {
    "/": "gray.800",
    "/login": "gray.800",
    "/dashboard": "bg-surface",
  };

  const logoColor: { [key: string]: string } = {
    "/": "white",
    "/login": "white",
    "/dashboard": "gray.900",
  };

  return (
    <Box as="nav" bg={bgStyle[asPath]} boxShadow="sm">
      <Container py={{ base: "3", lg: "4" }}>
        <Flex justify="space-between">
          <HStack spacing="4">
            <Logo color={logoColor[asPath]} />
          </HStack>
          {!session ? (
            <HStack spacing="4">
              <Button size="sm" colorScheme="blue" onClick={() => signIn()}>
                Login
              </Button>
            </HStack>
          ) : (
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <Avatar
                  boxSize="10"
                  color="white"
                  cursor="pointer"
                  name={user?.name ?? ""}
                  src={user?.image ?? ""}
                />
              </PopoverTrigger>
              <PopoverContent
                _focus={{ shadow: "lg" }}
                maxW="200px"
                shadow="lg"
              >
                <PopoverBody px="0">
                  <List px="0.5rem">
                    <ListItem
                      p="0.5rem"
                      rounded="8px"
                      cursor="pointer"
                      onClick={() => signOut()}
                      _hover={{ bg: "gray.100" }}
                    >
                      <ListIcon as={MdLogout} />
                      Logout
                    </ListItem>
                  </List>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Flex>
      </Container>
    </Box>
  );
};
