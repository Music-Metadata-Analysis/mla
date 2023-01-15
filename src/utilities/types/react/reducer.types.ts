import type { Reducer } from "react";

export interface ActionType {
  type: string;
}

export type MiddlewareType<STATE, ACTION> = (
  reducer: Reducer<STATE, ACTION>
) => Reducer<STATE, ACTION>;

export type MiddlewareOrReducerType<STATE, ACTION> =
  | Reducer<STATE, ACTION>
  | MiddlewareType<STATE, ACTION>;

export type NestedType<STATE, ACTION> = (
  encapsulated: MiddlewareOrReducerType<STATE, ACTION>
) => MiddlewareOrReducerType<STATE, ACTION>;

export type StateType = Record<string, unknown>;
