import {
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
} from "@chakra-ui/react";
import React from "react";
import { MdSearch } from "react-icons/md";

export const SearchInput = (props: InputProps) => {
  const { size, ...rest } = props;

  return (
    <InputGroup size={size}>
      <InputLeftElement pointerEvents="none">
        <MdSearch color="gray.300" />
      </InputLeftElement>
      <Input type="search" {...rest} />
    </InputGroup>
  );
};
