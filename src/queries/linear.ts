import {
  getTeam,
  getTeamIssues,
  getTeamIssueStates,
  getTeams,
} from "@/service/linear";
import { Issue, PageInfo, Team } from "@linear/sdk";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useGetTeams = (
  options?: UseQueryOptions<{ teams: Team[]; meta: PageInfo }>
) =>
  useQuery<{ teams: Team[]; meta: PageInfo }>(
    ["linear-teams"],
    getTeams,
    options
  );

export const useGetTeam = (team_id: string, options?: UseQueryOptions<Team>) =>
  useQuery<Team>(["linear-team", team_id], () => getTeam(team_id), options);

export const useGetTeamIssueStates = (
  team_id: string,
  options?: UseQueryOptions<{
    states: any[];
    meta: PageInfo;
  }>
) =>
  useQuery<{
    states: any[];
    meta: PageInfo;
  }>(
    ["linear-team-states", team_id],
    () => getTeamIssueStates(team_id),
    options
  );

export const useGetTeamIssues = (
  payload: { team_id: string; start_date?: string; states: string[] },
  options?: UseQueryOptions<{
    issues: Issue[];
    meta: PageInfo;
  }>
) =>
  useQuery<{
    issues: Issue[];
    meta: PageInfo;
  }>(
    ["linear-team-issues", payload.team_id, payload.start_date, payload.states],
    () => getTeamIssues(payload),
    options
  );
