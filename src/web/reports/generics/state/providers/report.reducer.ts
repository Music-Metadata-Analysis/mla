import getReducerStates from "./states/report.reducer.states";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import type { ReportActionType } from "@src/web/reports/generics/types/state/providers/report.action.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

export const coreReportReducer = (
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

const middlewares = [webFrameworkVendor.reducers.middlewares.logger];
export const ReportReducer = webFrameworkVendor.reducers.applyMiddleware<
  ReportStateInterface,
  ReportActionType
>(coreReportReducer, middlewares);
