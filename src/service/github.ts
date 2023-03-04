import axios from "axios";

export const getUserRepos = async () => {
  const { data } = await axios.get("/api/github/repos");
  return data;
};
