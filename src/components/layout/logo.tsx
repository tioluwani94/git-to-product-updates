import { Heading, HeadingProps } from "@chakra-ui/react";
import React from "react";

export const Logo = (props: HeadingProps) => {
  return (
    <Heading size="xs" {...props}>
      VersionVault
    </Heading>
  );
};
