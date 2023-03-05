import axios from "axios";

export const getUserRepos = async () => {
  const { data } = await axios.get("/api/github/repos/list");
  return data;
};

export const getReposCommits = async (params: {
  until?: string;
  repo_name: string;
}) => {
  const { data } = await axios.get("/api/github/commits/list", {
    params,
  });
  return data;
};
