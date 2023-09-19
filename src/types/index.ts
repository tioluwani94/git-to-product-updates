export type PromptJSONPayload = {
  author: string;
  title?: string;
  timestamp: string;
  description: string;
};
export interface ClickUpProfile {
  user: {
    id: number;
    username: string;
    color: string;
    profilePicture: string;
  };
}

export interface ClickUpTeam {
  id: string;
  name: string;
  color: string;
  avatar: string;
  members: {
    user: {
      id: number;
      username: string;
      color: string;
      profilePicture: string;
    };
  }[];
}

export interface ClickUpSpace {
  id: string;
  name: string;
  private: boolean;
  features: object;
  multiple_assignees: boolean;
  status: { status: string; type: string; orderindex: number; color: string }[];
}

export interface ClickUpFolder {
  id: string;
  name: string;
  lists: ClickUpList[];
  hidden: boolean;
  orderindex: number;
  override_statuses: boolean;
  space: {
    id: string;
    name: string;
    access: boolean;
  };
  task_count: string;
}

export interface ClickUpList {
  id: string;
  name: string;
  orderindex: number;
  content: string;
  status: {
    status: string;
    color: string;
    hide_label: boolean;
  } | null;
  priority: {
    priority: string;
    color: string;
  };
  assignee: null;
  task_count: number | null;
  due_date: string;
  start_date: string | null;
  folder: {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  };
  space: {
    id: string;
    name: string;
    access: boolean;
  };
  archived: boolean;
  override_statuses: boolean;
  permission_level: string;
}
