import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

export const LoadingSkeleton: React.FC<{ number?: number }> = ({
  number = 8,
}) => {
  return (
    <Stack spacing="3">
      {Array.from({ length: number }, (v, i) => (
        <Skeleton
          h="45px"
          key={`${i}`}
          rounded="md"
          endColor="gray.200"
          startColor="gray.100"
        />
      ))}
    </Stack>
  );
};
