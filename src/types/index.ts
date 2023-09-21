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
  statuses?: {
    type: string;
    color: string;
    status: string;
    orderindex: number;
  }[];
}

export interface ClickupTask {
  id: string;
  name: string;
  status: {
    status: string;
    color: string;
    orderindex: number;
    type: string;
  };
  orderindex: string;
  date_created: string;
  date_updated: string;
  date_closed: string | null;
  date_done: string | null;
  creator: {
    id: number;
    username: string;
    color: string;
    profilePicture: string;
  };
  assignees: string[];
  checklists: string[];
  tags: string[];
  parent: string | null;
  priority: string | null;
  due_date: string | null;
  start_date: string | null;
  time_estimate: string | null;
  time_spent: string | null;
  list: {
    id: string;
  };
  folder: {
    id: string;
  };
  space: {
    id: string;
  };
  url: string;
  text_content?: string;
  description?: string;
}
