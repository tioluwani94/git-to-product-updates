import {
  HStack,
  Spinner as ChakraSpinner,
  SpinnerProps,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";

export const Spinner = (props: SpinnerProps) => {
  return (
    <ChakraSpinner
      speed="0.65s"
      thickness="4px"
      color="blue.500"
      emptyColor="gray.200"
      {...props}
    />
  );
};

export const SpinnerWithText = (
  props: SpinnerProps & { children: ReactNode }
) => {
  const { children, ...rest } = props;
  return (
    <HStack>
      <Spinner {...rest} />
      {children}
    </HStack>
  );
};
