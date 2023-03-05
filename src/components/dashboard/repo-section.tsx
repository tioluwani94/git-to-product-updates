import { useAuth } from "@/hooks/auth";
import { getReposCommits } from "@/service/github";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useDashboard } from "./provider";

export const RepoSection = () => {
  const { status } = useAuth();
  const { section, selectedRepo } = useDashboard();

  const { data: repoCommits, isInitialLoading: isLoadingRepoCommits } =
    useQuery(
      ["repo-commits", selectedRepo?.name],
      () => getReposCommits({ repo_name: selectedRepo.name }),
      {
        enabled: status === "authenticated" && !!selectedRepo,
      }
    );

  if (section !== 1) {
    return null;
  }

  return <div>RepoSection</div>;
};
