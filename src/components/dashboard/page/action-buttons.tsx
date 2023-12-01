import { Button, Stack, StackProps, ButtonProps } from "@chakra-ui/react";
import React from "react";

export const ActionButtons: React.FC<StackProps> = (props) => {
  return (
    <Stack
      w="100%"
      spacing={4}
      direction={{ base: "column", md: "row" }}
      {...props}
    />
  );
};

export const BackActionButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      size="sm"
      type="button"
      order={{ base: 2, md: 1 }}
      w={{ base: "100%", md: "50%" }}
      {...props}
    />
  );
};

export const ConfirmActionButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      size="sm"
      colorScheme="blue"
      order={{ base: 1, md: 2 }}
      w={{ base: "100%", md: "50%" }}
      {...props}
    />
  );
};
