import type { Reducer } from "react";

export type NestedType = (
  encapsulated: MiddlewareOrReducerType
) => MiddlewareOrReducerType;

export type MiddlewareType = (reducer: Reducer<any, any>) => Reducer<any, any>;

export type MiddlewareOrReducerType = Reducer<any, any> | MiddlewareType;

export interface ActionType {
  type: string;
  state: object;
}
