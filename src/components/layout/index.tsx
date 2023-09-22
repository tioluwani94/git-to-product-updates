import { Box, Flex } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Navbar } from "./navbar";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Flex flexDirection="column">
      <Navbar />
      <Box flex={1}>{children}</Box>
    </Flex>
  );
};
