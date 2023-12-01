import { CheckboxCard } from "@/components/layout/checkbox-card-group";
import {
  Badge,
  BadgeProps,
  RadioProps,
  Stack,
  Text,
  TextProps,
} from "@chakra-ui/react";

export const PageCheckboxCard: React.FC<RadioProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <CheckboxCard {...rest}>
      <Stack direction="column" spacing="2">
        {children}
      </Stack>
    </CheckboxCard>
  );
};

export const PageCheckboxCardTitle: React.FC<TextProps> = (props) => {
  return (
    <Text fontSize="sm" fontWeight="medium" color="fg.emphasized" {...props} />
  );
};

export const PageCheckboxCardDescription: React.FC<TextProps> = (props) => {
  return (
    <Text
      width="250px"
      textStyle="sm"
      color="fg.muted"
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
      {...props}
    />
  );
};

export const PageCheckboxCardBadge: React.FC<BadgeProps> = (props) => {
  return (
    <Badge size="sm" color="white" w="fit-content" display="block" {...props} />
  );
};
