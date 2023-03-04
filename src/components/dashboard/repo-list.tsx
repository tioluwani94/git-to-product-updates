import { Stack } from "@chakra-ui/react";
import { RepoItem } from "./repo-item";

export const RepoList = ({ repos }: { repos: any[] }) => {
  return (
    <Stack rounded="4px" borderWidth="1px" width="100%" spacing="0">
      {repos.map((repo, index) => (
        <RepoItem
          repo={repo}
          key={repo.id}
          borderBottomWidth={index === repos.length - 1 ? "0" : "1px"}
        />
      ))}
    </Stack>
  );
};
