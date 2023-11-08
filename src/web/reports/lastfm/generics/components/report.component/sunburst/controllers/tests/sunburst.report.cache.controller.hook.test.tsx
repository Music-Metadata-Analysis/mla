import { act, renderHook } from "@testing-library/react";
import dk from "deep-keys";
import useSunBurstCacheController, {
  SunBurstCacheControllerProps,
} from "../sunburst.report.cache.controller.hook";
import { createHookWrapper } from "@src/fixtures/mocks/mock.hook.wrapper";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import ReportCacheCreateClient from "@src/web/api/report.cache/clients/create/report.cache.create.api.client.class";
import ReportCacheRetrieveClient from "@src/web/api/report.cache/clients/retrieve/report.cache.retrieve.api.client.class";
import mockAuthHook, {
  mockUserProfile,
} from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";
import { InitialState } from "@src/web/reports/generics/state/providers/report.initial";
import { ReportContext } from "@src/web/reports/generics/state/providers/report.provider";
import mockHookValues from "@src/web/reports/lastfm/generics/components/report.component/sunburst/controllers/__mocks__/sunburst.report.cache.controller.hook.mock";
import { MockQueryClass } from "@src/web/reports/lastfm/generics/state/queries/tests/implementations/concrete.sunburst.query.class";
import type { LastFMAggregateReportResponseInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.aggregate.report.types";
import type { ReportContextInterface } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type SunBurstBaseReportState from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.sunburst.base.class";
import type { ReactNode } from "react";

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock(
  "@src/web/api/report.cache/clients/create/report.cache.create.api.client.class"
);

jest.mock(
  "@src/web/api/report.cache/clients/retrieve/report.cache.retrieve.api.client.class"
);

interface MockUserContextWithChildren {
  children?: ReactNode;
  mockContext: ReportContextInterface;
}

describe(useSunBurstCacheController.name, () => {
  let received: ReturnType<typeof arrange>;

  const mockDispatch = jest.fn();
  const queryInstance = new MockQueryClass();

  const mockHookProps: SunBurstCacheControllerProps<
    SunBurstBaseReportState<unknown>
  > = {
    queryClass: MockQueryClass,
    sourceName: "test",
    userName: "mockUserName",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthHook.user = { ...mockUserProfile };
  });

  const providerWrapper = ({
    children,
    mockContext,
  }: MockUserContextWithChildren) => {
    return (
      <ReportContext.Provider value={mockContext}>
        {children}
      </ReportContext.Provider>
    );
  };

  const arrange = (providerProps: ReportContextInterface) => {
    return renderHook(() => useSunBurstCacheController(mockHookProps), {
      wrapper: createHookWrapper<MockUserContextWithChildren>(providerWrapper, {
        mockContext: providerProps,
      }),
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange({
        reportProperties: { ...InitialState },
        dispatch: mockDispatch,
      });
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.read).toBeInstanceOf(Function);
      expect(received.result.current.write).toBeInstanceOf(Function);
    });

    describe("read", () => {
      let result: { bypassed: boolean };

      const checkInstansiateClient = () => {
        it("should instantitate the ReportCacheRetrieveClient as expected", () => {
          expect(ReportCacheRetrieveClient).toHaveBeenCalledTimes(1);
          expect(ReportCacheRetrieveClient).toHaveBeenCalledWith(
            mockDispatch,
            mockAnalyticsHook.event
          );
        });
      };

      const checkLookupMethod = () => {
        it("should call the ReportCacheRetrieveClient lookup method as expected", () => {
          expect(
            jest.mocked(ReportCacheRetrieveClient).mock.instances[0].lookup
          ).toHaveBeenCalledTimes(1);
          expect(
            jest.mocked(ReportCacheRetrieveClient).mock.instances[0].lookup
          ).toHaveBeenCalledWith({
            authenticatedUserName: mockAuthHook.user?.email,
            reportName: queryInstance.getReportTranslationKey().toLowerCase(),
            sourceName: mockHookProps.sourceName,
            userName: mockHookProps.userName,
          });
        });
      };

      describe("when cache retrieval is bypassed", () => {
        beforeEach(async () => {
          jest
            .mocked(ReportCacheRetrieveClient.prototype.lookup)
            .mockResolvedValue({ bypassed: true });
        });

        describe("when called", () => {
          beforeEach(async () => {
            received = arrange({
              reportProperties: { ...InitialState },
              dispatch: mockDispatch,
            });
            await act(async () => {
              result = await received.result.current.read();
            });
          });

          checkInstansiateClient();
          checkLookupMethod();

          it("should return the expected results", () => {
            expect(result.bypassed).toBe(true);
          });
        });
      });

      describe("when cache retrieval is NOT bypassed", () => {
        beforeEach(async () => {
          jest
            .mocked(ReportCacheRetrieveClient.prototype.lookup)
            .mockResolvedValue({ bypassed: false });
        });

        describe("when called", () => {
          beforeEach(async () => {
            received = arrange({
              reportProperties: { ...InitialState },
              dispatch: mockDispatch,
            });
            await act(async () => {
              result = await received.result.current.read();
            });
          });

          checkInstansiateClient();
          checkLookupMethod();

          it("should return the expected results", () => {
            expect(result.bypassed).toBe(false);
          });
        });
      });
    });

    describe("write", () => {
      let result: { bypassed: boolean };

      const checkInstansiateClient = () => {
        it("should instantitate the ReportCacheCreateClient as expected", () => {
          expect(ReportCacheCreateClient).toHaveBeenCalledTimes(1);
          expect(ReportCacheCreateClient).toHaveBeenCalledWith(
            mockDispatch,
            mockAnalyticsHook.event
          );
        });
      };

      const checkPopulateMethod = (mockBody: Record<string, unknown>) => {
        it("should call the ReportCacheCreateClient populate method as expected", () => {
          expect(
            jest.mocked(ReportCacheCreateClient).mock.instances[0].populate
          ).toHaveBeenCalledTimes(1);
          expect(
            jest.mocked(ReportCacheCreateClient).mock.instances[0].populate
          ).toHaveBeenCalledWith({
            authenticatedUserName: mockAuthHook.user?.email,
            reportName: queryInstance.getReportTranslationKey().toLowerCase(),
            sourceName: mockHookProps.sourceName,
            userName: mockHookProps.userName,
            body: mockBody,
          });
        });
      };

      const checkSecondCall = () => {
        describe("when write is called a second time", () => {
          beforeEach(async () => {
            jest.mocked(ReportCacheCreateClient).mockClear();
            await act(async () => {
              result = await received.result.current.write();
            });
          });

          it("should NOT instantiate the client again", () => {
            expect(ReportCacheCreateClient).toHaveBeenCalledTimes(0);
          });

          it("should return the expected results", () => {
            expect(result.bypassed).toBe(true);
          });
        });
      };

      describe("when cache writing is bypassed", () => {
        beforeEach(async () => {
          jest
            .mocked(ReportCacheCreateClient.prototype.populate)
            .mockResolvedValue({ bypassed: true });
        });

        describe("when the report is empty", () => {
          const state = { ...InitialState };

          beforeEach(async () => {
            (
              state.data.report
                .playCountByArtist as LastFMAggregateReportResponseInterface<
                unknown[]
              >
            ).content = [];
          });

          describe("when called", () => {
            beforeEach(async () => {
              received = arrange({
                reportProperties: { ...InitialState },
                dispatch: mockDispatch,
              });
              await act(async () => {
                result = await received.result.current.write();
              });
            });

            it("should NOT instantiate the client", () => {
              expect(ReportCacheCreateClient).toHaveBeenCalledTimes(0);
            });

            it("should return the expected results", () => {
              expect(result.bypassed).toBe(true);
            });

            checkSecondCall();
          });
        });

        describe("when the report is NOT empty", () => {
          const state = { ...InitialState };

          beforeEach(async () => {
            state.data.report.playCountByArtist?.content.push("MockData");
          });

          describe("when called", () => {
            beforeEach(async () => {
              state.data.report.playCountByArtist?.content.push("MockData");
              received = arrange({
                reportProperties: { ...state },
                dispatch: mockDispatch,
              });
              await act(async () => {
                result = await received.result.current.write();
              });
            });

            checkInstansiateClient();
            checkPopulateMethod(state);

            it("should return the expected results", () => {
              expect(result.bypassed).toBe(true);
            });

            checkSecondCall();
          });
        });
      });

      describe("when cache retrieval is NOT bypassed", () => {
        beforeEach(async () => {
          jest
            .mocked(ReportCacheCreateClient.prototype.populate)
            .mockResolvedValue({ bypassed: false });
        });

        describe("when the report is empty", () => {
          const state = { ...InitialState };

          beforeEach(async () => {
            (
              state.data.report
                .playCountByArtist as LastFMAggregateReportResponseInterface<
                unknown[]
              >
            ).content = [];
          });

          describe("when called", () => {
            beforeEach(async () => {
              received = arrange({
                reportProperties: { ...InitialState },
                dispatch: mockDispatch,
              });
              await act(async () => {
                result = await received.result.current.write();
              });
            });

            it("should NOT instantiate the client", () => {
              expect(ReportCacheCreateClient).toHaveBeenCalledTimes(0);
            });

            it("should return the expected results", () => {
              expect(result.bypassed).toBe(true);
            });

            checkSecondCall();
          });
        });

        describe("when the report is NOT empty", () => {
          const state = { ...InitialState };

          beforeEach(async () => {
            state.data.report.playCountByArtist?.content.push("MockData");
          });

          describe("when called", () => {
            beforeEach(async () => {
              state.data.report.playCountByArtist?.content.push("MockData");
              received = arrange({
                reportProperties: { ...state },
                dispatch: mockDispatch,
              });
              await act(async () => {
                result = await received.result.current.write();
              });
            });

            checkInstansiateClient();
            checkPopulateMethod(state);

            it("should return the expected results", () => {
              expect(result.bypassed).toBe(false);
            });

            checkSecondCall();
          });
        });
      });
    });
  });
});
