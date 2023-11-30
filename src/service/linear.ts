import axios from "axios";

export const getTeams = async () => {
  const { data } = await axios.get("/api/linear/team/list");
  return data;
};

export const getTeamIssues = async (team_id: string) => {
  const { data } = await axios.get(`/api/linear/issue/list/${team_id}`);
  return data;
};
