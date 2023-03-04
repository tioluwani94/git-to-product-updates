import { RepoList } from "@/components/dashboard/repo-list";
import { SpinnerWithText } from "@/components/layout/spinner";
import { useAuth } from "@/hooks/auth";
import { getUserRepos } from "@/service/github";
import { Box, Container, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { status } = useAuth();

  const { data: repos, isInitialLoading: isLoading } = useQuery(
    ["repos"],
    getUserRepos,
    {
      enabled: status === "authenticated",
    }
  );

  return (
    <Container py="2rem" height="100%">
      <Box rounded="4px" p="1rem" shadow="lg">
        <VStack spacing="1rem" alignItems="flex-start">
          <Stack isInline alignItems="center">
            <Heading size="sm">Import Git Repository</Heading>
          </Stack>
          {isLoading ? (
            <SpinnerWithText size="sm" thickness="2px">
              <Text>Fetching repositories...</Text>
            </SpinnerWithText>
          ) : (
            <RepoList repos={repos ?? []} />
          )}
        </VStack>
      </Box>
    </Container>
  );
}
