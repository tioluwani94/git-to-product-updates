import { useAuth } from "@/hooks/auth";
import { useSearch } from "@/hooks/use-search";
import { getUserRepos } from "@/service/github";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { SearchInput } from "../layout/search-input";
import { SpinnerWithText } from "../layout/spinner";
import { useDashboard } from "./provider";
import { RepoList } from "./repo-list";

export const ReposSection = () => {
  const { status } = useAuth();

  const { section, setSection, setSelectedRepo } = useDashboard();

  const { data: repos, isInitialLoading: isLoadingRepos } = useQuery(
    ["repos"],
    getUserRepos,
    {
      enabled: status === "authenticated",
    }
  );

  const {
    search,
    setSearch,
    filteredItems: filteredRepos,
  } = useSearch({
    items: repos,
    searchTerm: "name",
  });

  const handleSelectRepo = (repo: any) => {
    setSelectedRepo(repo);
    setSection(1);
  };

  if (section !== 0) {
    return null;
  }

  return (
    <Box bg="white" p="1rem" shadow="lg" rounded="4px">
      <VStack width="100%" height="80vh" spacing="1rem" alignItems="flex-start">
        <Flex width="100%" alignItems="center" justifyContent="space-between">
          <Heading fontSize="1.5rem">Import Git Repository</Heading>
          <Box>
            <SearchInput
              value={search}
              placeholder="Search repositories"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
        </Flex>
        <Box width="100%" overflowY="auto">
          {isLoadingRepos ? (
            <SpinnerWithText size="sm" thickness="2px">
              <Text>Fetching repositories...</Text>
            </SpinnerWithText>
          ) : (
            <RepoList
              repos={filteredRepos ?? []}
              onSelectRepo={handleSelectRepo}
            />
          )}
        </Box>
      </VStack>
    </Box>
  );
};
