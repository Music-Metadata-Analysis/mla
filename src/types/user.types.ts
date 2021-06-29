import { TopAlbumsResponseInterface } from "./proxy.types";

export interface UserStateInterface {
  userName: string | null;
  data: {} | TopAlbumsResponseInterface;
  profileUrl: string | null;
  ready: boolean;
  error: boolean;
}

export interface UserContextInterface {
  userProperties: UserStateInterface;
  dispatch: (action: UserActionType) => void;
}

export type UserActionType =
  | { type: "ResetState" }
  | { type: "StartFetchUser"; userName: string }
  | { type: "FailureFetchUser"; userName: string }
  | {
      type: "SuccessFetchUser";
      userName: string;
      data: TopAlbumsResponseInterface;
    };
