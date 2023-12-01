import {
  Button,
  ButtonProps,
  Heading,
  HeadingProps,
  StackProps,
  Text,
  TextProps,
  VStack,
} from "@chakra-ui/react";
import Image, { ImageProps } from "next/image";
import React from "react";

export const EmptyState: React.FC<StackProps> = (props) => {
  return <VStack pt={20} h="100%" justifyContent="center" {...props} />;
};

export const EmptyStateImage: React.FC<Partial<ImageProps>> = (props) => {
  return (
    <Image
      width={100}
      height={100}
      alt="task done"
      src="/images/no-task.png"
      {...props}
    />
  );
};

export const EmptyStateHeading: React.FC<HeadingProps> = (props) => {
  return <Heading fontSize="lg" lineHeight="unset" textAlign="center" />;
};

export const EmptyStateText: React.FC<TextProps> = (props) => {
  return <Text textAlign="center" color="gray.500" fontSize="sm" {...props} />;
};

export const EmptyStateButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button size="sm" type="button" order={{ base: 2, md: 1 }} {...props} />
  );
};
