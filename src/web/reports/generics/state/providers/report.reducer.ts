import getReducerStates from "./states/report.reducer.states";
import reducerLoggingMiddleware from "@src/utilities/react/state/reducers/reducer.logger";
import withMiddleware from "@src/utilities/react/state/reducers/reducer.middleware";
import type { ReportActionType } from "@src/web/reports/generics/types/state/providers/report.action.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

const reportReducer = (
  state: ReportStateInterface,
  action: ReportActionType
) => {
  let newState = state;
  getReducerStates().forEach((reducerStateClass) => {
    const reducerState = new reducerStateClass(newState, action);
    newState = reducerState.apply();
  });
  return newState;
};

const middlewares = [reducerLoggingMiddleware];
export const ReportReducer = withMiddleware<
  ReportStateInterface,
  ReportActionType
>(reportReducer, middlewares);
