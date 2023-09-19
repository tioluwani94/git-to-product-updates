import axios from "axios";

export const getTeams = async () => {
  const { data } = await axios.get("/api/clickup/team/list");
  return data;
};

export const getSpaces = async (team_id: string) => {
  const { data } = await axios.get("/api/clickup/space/list", {
    params: { team_id },
  });
  return data;
};

export const getFolders = async (space_id: string) => {
  const { data } = await axios.get("/api/clickup/folder/list", {
    params: { space_id },
  });
  return data;
};

export const getLists = async (folder_id: string) => {
  const { data } = await axios.get("/api/clickup/list/list", {
    params: { folder_id },
  });
  return data;
};

export const getFolderlessLists = async (space_id: string) => {
  const { data } = await axios.get("/api/clickup/list/folderless-list", {
    params: { space_id },
  });
  return data;
};

export const getList = async (list_id: string) => {
  const { data } = await axios.get(`/api/clickup/list/${list_id}`);
  return data;
};
