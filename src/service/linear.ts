import axios from "axios";

export const getTeams = async () => {
  const { data } = await axios.get("/api/linear/team/list");
  return data;
};
