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
