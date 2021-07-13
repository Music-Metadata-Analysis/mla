import { TopAlbumsProxyResponseInterface } from "./proxy.types";
import { LastFMTopAlbumsProxyResponseInterface } from "./lastfm.types";

export interface UserStateInterface {
  userName: string | null;
  data:
    | {}
    | TopAlbumsProxyResponseInterface
    | LastFMTopAlbumsProxyResponseInterface;
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
      data: TopAlbumsProxyResponseInterface;
    };
