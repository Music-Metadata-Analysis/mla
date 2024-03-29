import {
  mockAlbumsReport,
  mockReportStateWithError,
} from "./fixtures/report.state.data";
import ConcreteStateOne, {
  mockReadyState,
} from "./implementations/concrete.report.state.1.class";
import ConcreteStateTwo, {
  mockResetState,
} from "./implementations/concrete.report.state.2.class";
import ConcreteStateThree, {
  mockStartState,
} from "./implementations/concrete.report.state.3.class";
import { InitialState } from "../report.initial";
import { ReportReducer, coreReportReducer } from "../report.reducer";
import {
  mockApplyMiddleware,
  mockLoggingMiddleware,
} from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import type { ReportActionType } from "@src/web/reports/generics/types/state/providers/report.action.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";
import type { LastFMBaseReportInterface } from "@src/web/reports/lastfm/generics/types/state/lastfm.base.report.types";

jest.mock("@src/vendors/integrations/web.framework/vendor");

jest.mock("../states/report.reducer.states", () => () => mockClasses);

const mockClasses = [ConcreteStateOne, ConcreteStateTwo, ConcreteStateThree];

describe("ReportReducer", () => {
  let received: ReportStateInterface | null;
  const testIntegrationType = "TEST" as const;

  beforeEach(() => {
    received = null;
  });

  const getInitialState = () => JSON.parse(JSON.stringify(InitialState));

  const arrange = (
    action: ReportActionType | { type: "NoAction" },
    initialProps: ReportStateInterface
  ) => {
    return ReportReducer({ ...initialProps }, action as ReportActionType);
  };

  it("should be wrapped in the correct middlewares", () => {
    expect(mockApplyMiddleware).toHaveBeenCalledTimes(1);
    expect(mockApplyMiddleware).toHaveBeenCalledWith(coreReportReducer, [
      mockLoggingMiddleware,
    ]);
  });

  it("should handle ReadyFetch correctly", () => {
    const action = {
      type: "ReadyFetch" as const,
      userName: "someguy",
      data: mockAlbumsReport as LastFMBaseReportInterface,
      integration: testIntegrationType,
    };
    received = arrange(action, { ...getInitialState() });
    expect(received).toBe(mockReadyState);
  });

  it("should handle ResetState correctly", () => {
    const action = {
      type: "ResetState" as const,
    };
    received = arrange(action, mockReportStateWithError);
    expect(received).toBe(mockResetState);
  });

  it("should handle StartFetch correctly", () => {
    const action = {
      type: "StartFetch" as const,
      userName: "someguy",
      integration: testIntegrationType,
    };
    received = arrange(action, mockReportStateWithError);
    expect(received).toBe(mockStartState);
  });

  it("should handle an Unknown Action correctly", () => {
    const action = {
      type: "UnknownAction",
    } as unknown as ReportActionType;
    received = arrange(action, { ...getInitialState() });
    expect(received).toStrictEqual({ ...getInitialState() });
  });
});
