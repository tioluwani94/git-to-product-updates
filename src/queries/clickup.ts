import {
  getFolderlessLists,
  getFolders,
  getList,
  getSpaces,
  getTasks,
  getTeams,
} from "@/service/clickup";
import {
  ClickUpFolder,
  ClickUpList,
  ClickUpSpace,
  ClickUpTeam,
  ClickupTask,
} from "@/types";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import getUnixTime from "date-fns/getUnixTime";

export const useGetClickupTeams = (options?: UseQueryOptions<ClickUpTeam[]>) =>
  useQuery<ClickUpTeam[]>(["clickup-teams"], getTeams, options);

export const useGetSpaces = (
  team_id: string,
  options?: UseQueryOptions<ClickUpSpace[]>
) =>
  useQuery<ClickUpSpace[]>(
    ["clickup-spaces"],
    () => getSpaces(team_id),
    options
  );

export const useGetFolders = (
  space_id: string,
  options?: UseQueryOptions<ClickUpFolder[]>
) =>
  useQuery<ClickUpFolder[]>(
    ["clickup-folders", space_id],
    () => getFolders(space_id ?? ""),
    { enabled: !!space_id, ...options }
  );

export const useGetFolderlessLists = (
  space_id: string,
  options?: UseQueryOptions<ClickUpFolder[]>
) =>
  useQuery<ClickUpFolder[]>(
    ["clickup-foldersless-lists", space_id],
    () => getFolderlessLists(space_id),
    { enabled: !!space_id, ...options }
  );

export const useGetList = (
  list_id: string,
  options?: UseQueryOptions<ClickUpList>
) =>
  useQuery<ClickUpList>(
    ["clickup-list", list_id],
    () => getList(list_id ?? ""),
    { enabled: !!list_id, ...options }
  );

export const useGetTasks = (
  data: {
    selectedList: string;
    statuses: string[];
    start_date: string | undefined;
    end_date: string | undefined;
  },
  options?: UseQueryOptions<ClickupTask[]>
) => {
  const { selectedList, statuses, start_date, end_date } = data;
  return useQuery<ClickupTask[]>(
    ["clickup-list-task", selectedList, statuses, start_date, end_date],
    () =>
      getTasks(selectedList ?? "", {
        archived: false,
        statuses: statuses,
        date_done_lt: end_date ? getUnixTime(new Date(end_date)) : undefined,
        date_done_gt: start_date
          ? getUnixTime(new Date(start_date))
          : undefined,
      }),
    options
  );
};
