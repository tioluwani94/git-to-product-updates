import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Navbar } from "./navbar";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Flex flexDirection="column">
      <Navbar />
      {children}
    </Flex>
  );
};
