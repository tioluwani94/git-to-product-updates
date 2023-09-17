import axios from "axios";

export const getTeams = async () => {
  const { data } = await axios.get("/api/clickup/teams/list");
  return data;
};
