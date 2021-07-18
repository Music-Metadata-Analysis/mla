import { TopAlbumsProxyResponseInterface } from "./proxy.types";
import { LastFMTopAlbumsProxyResponseInterface } from "./lastfm.types";

export interface UserStateInterface {
  userName: string | null;
  data:
    | {}
    | TopAlbumsProxyResponseInterface
    | LastFMTopAlbumsProxyResponseInterface;
  ratelimited: boolean;
  profileUrl: string | null;
  ready: boolean;
  error: boolean;
}

export type userDispatchType = (action: UserActionType) => void;

export interface UserContextInterface {
  userProperties: UserStateInterface;
  dispatch: userDispatchType;
}

export type UserActionType =
  | { type: "ResetState" }
  | { type: "StartFetchUser"; userName: string }
  | { type: "RatelimitedFetchUser"; userName: string }
  | { type: "FailureFetchUser"; userName: string }
  | {
      type: "SuccessFetchUser";
      userName: string;
      data: TopAlbumsProxyResponseInterface;
    };
