import React from "react";

export type NestedType = (
  encapsulated: MiddlewareOrReducerType
) => MiddlewareOrReducerType;

export type MiddlewareType = (
  reducer: React.Reducer<any, any>
) => React.Reducer<any, any>;

export type MiddlewareOrReducerType = React.Reducer<any, any> | MiddlewareType;

export interface ActionType {
  type: string;
  state: object;
}
