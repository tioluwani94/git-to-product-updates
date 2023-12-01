import { appendObjToUrl } from "@/utils/functions";
import { Issue, PageInfo, Team } from "@linear/sdk";
import axios from "axios";

export const getTeams = async () => {
  const { data } = await axios.get<{
    teams: Team[];
    meta: PageInfo;
  }>("/api/linear/team/list");
  return data;
};

export const getTeam = async (team_id: string) => {
  const { data } = await axios.get<{ team: Team }>(
    `/api/linear/team/${team_id}`
  );
  return data.team;
};

export const getTeamIssueStates = async (team_id: string) => {
  const { data } = await axios.get<{
    states: any[];
    meta: PageInfo;
  }>(`/api/linear/team/${team_id}/state`, { params: {} });
  return data;
};

export const getTeamIssues = async (payload: {
  team_id: string;
  states: string[];
  start_date?: string;
}) => {
  const { team_id, states, start_date } = payload;
  const params = { states, start_date };

  const { data } = await axios.get<{
    issues: Issue[];
    meta: PageInfo;
  }>(`/api/linear/team/${team_id}/issue?${appendObjToUrl(params ?? {})}`);
  return data;
};
