import { Button, Flex, FlexProps, HStack, Text } from "@chakra-ui/react";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { MdLockOutline } from "react-icons/md";

export const RepoItem = ({
  repo,
  onClick,
}: { repo: any; onClick(): void } & FlexProps) => {
  return (
    <Flex
      p="0.875rem 1rem"
      alignItems="center"
      borderBottomWidth="1px"
      justifyContent="space-between"
    >
      <HStack>
        <HStack>
          <Text>{repo.name}</Text>
          {repo.visibility === "private" && <MdLockOutline />}
        </HStack>
        <Text>·</Text>
        <Text fontSize="0.875rem" color="gray.500">
          {formatDistanceToNowStrict(new Date(repo.created_at), {
            addSuffix: true,
          })}
        </Text>
      </HStack>
      <Button size="sm" onClick={onClick}>
        Import
      </Button>
    </Flex>
  );
};
