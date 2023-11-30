import { getTeamIssues, getTeams } from "@/service/linear";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export const useGetTeams = (options?: UseQueryOptions<any>) =>
  useQuery<any>(["linear-teams"], getTeams, options);

export const useGetTeamIssues = (
  team_id: string,
  options?: UseQueryOptions<any>
) =>
  useQuery<any>(
    ["linear-team", team_id],
    () => getTeamIssues(team_id),
    options
  );
