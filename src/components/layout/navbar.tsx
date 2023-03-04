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
import { Logo } from "./logo";
import { FaGithub } from "react-icons/fa";

export const Navbar = () => {
  const isLoggedIn = false;
  return (
    <Box as="nav" bg="bg-surface" boxShadow="sm">
      <Container py={{ base: "3", lg: "4" }}>
        <Flex justify="space-between">
          <HStack spacing="4">
            <Logo />
          </HStack>
          {!isLoggedIn ? (
            <HStack spacing="4">
              <Button size="sm" colorScheme="blue" leftIcon={<FaGithub />}>
                Sign in with Github
              </Button>
            </HStack>
          ) : (
            <Popover>
              <PopoverTrigger>
                <Avatar
                  boxSize="10"
                  cursor="pointer"
                  name="Christoph Winston"
                  src="https://tinyurl.com/yhkm2ek8"
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody px="0">
                  <List px="0.5rem">
                    <ListItem
                      p="0.5rem"
                      rounded="8px"
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                    >
                      <ListIcon />
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
