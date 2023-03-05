import axios from "axios";

export const getUserRepos = async () => {
  const { data } = await axios.get("/api/github/repo/list");
  return data;
};

export const getRepoCommits = async (params: {
  until?: string;
  repo_name: string;
}) => {
  const { data } = await axios.get("/api/github/commit/list", {
    params,
  });
  return data;
};

export const getRepoPullRequests = async (params: { repo_name: string }) => {
  const { data } = await axios.get("/api/github/pull-request/list", {
    params,
  });
  return data;
};
