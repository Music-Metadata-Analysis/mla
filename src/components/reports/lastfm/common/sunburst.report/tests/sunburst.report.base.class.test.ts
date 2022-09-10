import { MockReportClass } from "./fixtures/mock.sunburst.report.class";
import mockLastFMHook from "../../../../../../hooks/tests/lastfm.mock.hook";
import MockStage2Report from "../../../../../../providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import PlayCountByArtistState from "../../../../../../providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import SunBurstDataTranslator from "../chart/chart.data.class";
import MockCompleteReport1 from "../chart/tests/fixtures/mock.state.data.1.json";
import type { PlayCountByArtistReportInterface } from "../../../../../../types/clients/api/lastfm/response.types";
import type {
  AggregateBaseReportResponseInterface,
  AggregateReportOperationType,
} from "../../../../../../types/integrations/base.types";
import type {
  d3Node,
  SunBurstData,
} from "../../../../../../types/reports/sunburst.types";
import type { userHookAsLastFM } from "../../../../../../types/user/hook.types";
import type { LastFMUserStateBase } from "../../../../../../types/user/state.types";
import type { BillBoardProgressBarDetails } from "../../../../../billboard/billboard.progress.bar/billboard.progress.bar.component";
import type { LastFMSunBurstDrawerInterface } from "../../sunburst.report.drawer/sunburst.report.drawer.component";
import type SunBurstNodeEncapsulation from "../encapsulations/sunburst.node.encapsulation.base";
import type SunBurstBaseReport from "../sunburst.report.base.class";
import type { FC } from "react";

jest.mock("../chart/chart.data.class.ts", () =>
  jest.fn(() => ({
    convert: mockConvert,
  }))
);

const mockConvert = jest.fn();

describe("SunBurstBaseReport", () => {
  let instance: SunBurstBaseReport<PlayCountByArtistState>;
  let mockUserState: LastFMUserStateBase;
  const mockT = jest.fn((key: string) => `t(${key})`);

  describe("When instantiated with a concrete implementation", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      instance = new MockReportClass();
      mockUserState = JSON.parse(JSON.stringify(MockStage2Report));
    });

    const getUserState = () =>
      mockUserState.data.report
        .playCountByArtist as AggregateBaseReportResponseInterface<
        PlayCountByArtistReportInterface[]
      >;

    const getUserStateOperation = () =>
      getUserState().status.operation as AggregateReportOperationType;

    describe("getDrawerComponent", () => {
      let received: FC<LastFMSunBurstDrawerInterface>;

      beforeEach(() => (received = instance.getDrawerComponent()));

      it("should return the expected drawer component", () => {
        expect(received).toBe(instance.drawerComponent);
      });
    });

    describe("getEncapsulatedNode", () => {
      let received: SunBurstNodeEncapsulation;
      const mockNode = {
        data: { name: "mockNode", entity: "unknown" },
      } as d3Node;

      beforeEach(() => (received = instance.getEncapsulatedNode(mockNode)));

      it("should return an instance of expected encapsulation class", () => {
        expect(received).toBeInstanceOf(instance.nodeEncapsulationClass);
      });

      it("should return the the correct encapsulated node", () => {
        expect(received.getNode()).toBe(mockNode);
      });
    });

    describe("getEncapsulatedUserState", () => {
      let received: PlayCountByArtistState;

      beforeEach(
        () => (received = instance.getEncapsulatedUserState(mockUserState))
      );

      it("should be an instance of PlayCountByArtistState", () => {
        expect(received).toBeInstanceOf(PlayCountByArtistState);
      });

      it("should contain the expected userProperties ", () => {
        expect(received.userProperties).toStrictEqual(mockUserState);
      });
    });

    describe("getEntityLeaf", () => {
      let received: SunBurstData["entity"];

      beforeEach(() => (received = instance.getEntityLeaf()));

      it("should return the last entity in the entityKeys list", () => {
        expect(received).toBe(
          instance.entityKeys[instance.entityKeys.length - 1]
        );
      });
    });

    describe("getEntityTopLevel", () => {
      let received: SunBurstData["entity"];

      beforeEach(() => (received = instance.getEntityTopLevel()));

      it("should return the first entity in the entityKeys list", () => {
        expect(received).toBe(instance.entityKeys[0]);
      });
    });

    describe("getProgressPercentage", () => {
      let received: number;

      describe("with total steps as 0", () => {
        beforeEach(() => {
          getUserState().status.complete = false;
          getUserState().status.steps_total = 0;
          getUserState().status.steps_complete = 0;
          received = instance.getProgressPercentage(mockUserState);
        });

        it("should equal 0", () => {
          expect(received).toBe(0);
        });
      });

      describe("with total steps as 50, and completed as 25", () => {
        beforeEach(() => {
          getUserState().status.complete = false;
          getUserState().status.steps_total = 50;
          getUserState().status.steps_complete = 25;
          received = instance.getProgressPercentage(mockUserState);
        });

        it("should equal 50", () => {
          expect(received).toBe(50);
        });
      });

      describe("with the report marked as complete", () => {
        beforeEach(() => {
          getUserState().status.complete = true;
          received = instance.getProgressPercentage(mockUserState);
        });

        it("should equal 100", () => {
          expect(received).toBe(100);
        });
      });
    });

    describe("getProgressDetails", () => {
      let received: BillBoardProgressBarDetails;

      describe("with no operational details attached", () => {
        beforeEach(() => {
          delete getUserState().status.operation;
          received = instance.getProgressDetails(mockUserState, mockT);
        });

        it("should return the expected details", () => {
          expect(received.resource).toBe("");
          expect(received.type).toBe("");
        });
      });

      describe("with valid operational details attached to the user state", () => {
        beforeEach(() => {
          getUserState().status.complete = false;
          getUserStateOperation().type = "Top Artists";
          getUserStateOperation().resource = "The Cure";
          received = instance.getProgressDetails(mockUserState, mockT);
        });

        it("should return the expected details", () => {
          expect(received.resource).toBe(getUserStateOperation().resource);
          expect(received.type).toBe(
            `t(detailTypes.${getUserStateOperation().type})`
          );
        });
      });
    });

    describe("getRetryRoute", () => {
      it("should return the expected value", () => {
        expect(instance.getRetryRoute()).toBe(instance.retryRoute);
      });
    });

    describe("getReportTranslationKey", () => {
      it("should return the expected value", () => {
        expect(instance.getReportTranslationKey()).toBe(
          instance.translationKey
        );
      });
    });

    describe("getSunBurstData", () => {
      let result: unknown;

      describe("when given a finished report", () => {
        beforeEach(() => {
          mockConvert.mockReturnValueOnce({ mock: "return_value" });
          result = instance.getSunBurstData(
            MockCompleteReport1 as LastFMUserStateBase,
            "Top Artists"
          );
        });

        it("should instantiate the SunBurstDataTranslator class", () => {
          expect(SunBurstDataTranslator).toBeCalledTimes(1);
          expect(SunBurstDataTranslator).toBeCalledWith(instance.entityKeys);
        });

        it("should call the convert method of the sunBurstDataTranslator class", () => {
          expect(mockConvert).toBeCalledTimes(1);
          expect(mockConvert).toBeCalledWith(
            {
              children: [],
              entity: "root",
              name: "Top Artists",
              value: MockCompleteReport1.data.report.playcount,
            },
            instance.getReportData(MockCompleteReport1 as LastFMUserStateBase)
              .content,
            instance.getEntityTopLevel()
          );
        });

        it("should return the expected value", () => {
          expect(result).toStrictEqual({ mock: "return_value" });
        });
      });
    });

    describe("queryIsDataReady", () => {
      let received: boolean;

      describe("when an api request is NOT in progress", () => {
        beforeEach(() => {
          mockUserState.inProgress = false;
        });

        describe("when the report is complete", () => {
          beforeEach(() => {
            getUserState().status.complete = true;
          });

          describe("when the report is not ready", () => {
            beforeEach(() => {
              mockUserState.ready = false;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockUserState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockUserState.error = null;
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(true);
              });
            });
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockUserState.ready = true;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockUserState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockUserState.error = null;
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return true", () => {
                expect(received).toBe(false);
              });
            });
          });
        });

        describe("when the report is NOT complete", () => {
          beforeEach(() => {
            getUserState().status.complete = false;
          });

          describe("when the report is not ready", () => {
            beforeEach(() => {
              mockUserState.ready = false;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockUserState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockUserState.error = null;
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockUserState.ready = true;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockUserState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockUserState.error = null;
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return true", () => {
                expect(received).toBe(false);
              });
            });
          });
        });
      });

      describe("when an api request is in progress", () => {
        beforeEach(() => {
          mockUserState.inProgress = true;
        });

        describe("when the report is complete", () => {
          beforeEach(() => {
            getUserState().status.complete = true;
          });

          describe("when the report is not ready", () => {
            beforeEach(() => {
              mockUserState.ready = false;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockUserState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockUserState.error = null;
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockUserState.ready = true;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockUserState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockUserState.error = null;
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return true", () => {
                expect(received).toBe(false);
              });
            });
          });
        });

        describe("when the report is NOT complete", () => {
          beforeEach(() => {
            getUserState().status.complete = false;
          });

          describe("when the report is not ready", () => {
            beforeEach(() => {
              mockUserState.ready = false;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockUserState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockUserState.error = null;
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockUserState.ready = true;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockUserState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockUserState.error = null;
                received = instance.queryIsDataReady(mockUserState);
              });

              it("should return true", () => {
                expect(received).toBe(false);
              });
            });
          });
        });
      });
    });

    describe("queryIsResumable", () => {
      let received: boolean;

      const truthTable = (mutablePath: boolean) => {
        describe("when the report is in progress", () => {
          beforeEach(() => {
            mockUserState.inProgress = true;
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockUserState.ready = true;
            });

            describe("when the report is complete", () => {
              beforeEach(() => {
                getUserState().status.complete = true;
                received = instance.queryIsResumable(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report is NOT complete", () => {
              beforeEach(() => {
                getUserState().status.complete = false;
                received = instance.queryIsResumable(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });

          describe("when the report is NOT ready", () => {
            beforeEach(() => {
              mockUserState.ready = false;
            });

            describe("when the report is complete", () => {
              beforeEach(() => {
                getUserState().status.complete = true;
                received = instance.queryIsResumable(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report is NOT complete", () => {
              beforeEach(() => {
                getUserState().status.complete = false;
                received = instance.queryIsResumable(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });
        });

        describe("when the report is NOT in progress", () => {
          beforeEach(() => {
            mockUserState.inProgress = false;
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockUserState.ready = true;
            });

            describe("when the report is complete", () => {
              beforeEach(() => {
                getUserState().status.complete = true;
                received = instance.queryIsResumable(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report is NOT complete", () => {
              beforeEach(() => {
                getUserState().status.complete = false;
                received = instance.queryIsResumable(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });

          describe("when the report is NOT ready", () => {
            beforeEach(() => {
              mockUserState.ready = false;
            });

            describe("when the report is complete", () => {
              beforeEach(() => {
                getUserState().status.complete = true;
                received = instance.queryIsResumable(mockUserState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report is NOT complete", () => {
              beforeEach(() => {
                getUserState().status.complete = false;
                received = instance.queryIsResumable(mockUserState);
              });

              it(`should return ${mutablePath}`, () => {
                expect(received).toBe(mutablePath);
              });
            });
          });
        });
      };

      describe("when there is NO error", () => {
        beforeEach(() => {
          mockUserState.error = null;
        });

        truthTable(true);
      });

      describe("when there is an TimeoutFetch error", () => {
        beforeEach(() => {
          mockUserState.error = "TimeoutFetch";
        });

        truthTable(true);
      });

      describe("when there is an DataPoint error", () => {
        beforeEach(() => {
          mockUserState.error = "DataPointFailureFetch";
        });

        truthTable(true);
      });

      describe("when there some other error", () => {
        beforeEach(() => {
          mockUserState.error = "NotFoundFetch";
        });

        truthTable(false);
      });
    });

    describe("queryUserHasData", () => {
      let received: boolean;

      const truthTable = (mutableParam1: boolean, mutableParam2: boolean) => {
        describe("when there is a username", () => {
          beforeEach(() => (mockUserState.userName = "niall-byrne"));

          describe("when there is content", () => {
            beforeEach(() => {
              getUserState().content = [
                { name: "The Cure", playcount: 0, albums: [], fetched: false },
              ];
              received = instance.queryUserHasData(mockUserState);
            });

            it(`should return ${mutableParam1}`, () => {
              expect(received).toBe(mutableParam1);
            });
          });

          describe("when there is NOT content", () => {
            beforeEach(() => {
              getUserState().content = [];
              received = instance.queryUserHasData(mockUserState);
            });

            it(`should return ${!mutableParam2}`, () => {
              expect(received).toBe(mutableParam2);
            });
          });
        });

        describe("when there is NOT a username", () => {
          beforeEach(() => (mockUserState.userName = null));

          describe("when there is content", () => {
            beforeEach(() => {
              getUserState().content = [
                { name: "The Cure", playcount: 0, albums: [], fetched: false },
              ];
              received = instance.queryUserHasData(mockUserState);
            });

            it("should return true", () => {
              expect(received).toBe(true);
            });
          });

          describe("when there is NOT content", () => {
            beforeEach(() => {
              getUserState().content = [];
              received = instance.queryUserHasData(mockUserState);
            });

            it("should return true", () => {
              expect(received).toBe(true);
            });
          });
        });
      };

      describe("when the report is ready", () => {
        beforeEach(() => (mockUserState.ready = true));

        truthTable(true, false);
      });

      describe("when the report is NOT ready", () => {
        beforeEach(() => (mockUserState.ready = false));

        truthTable(true, true);
      });
    });

    describe("getReportData", () => {
      let received: AggregateBaseReportResponseInterface<unknown[]>;

      beforeEach(() => (received = instance.getReportData(mockUserState)));

      it("should contain the expected userProperties ", () => {
        expect(received).toStrictEqual(
          mockUserState.data.report.playCountByArtist
        );
      });
    });

    describe("startDataFetch", () => {
      beforeEach(() =>
        instance.startDataFetch(
          mockLastFMHook as userHookAsLastFM,
          "niall-byrne"
        )
      );

      it("should contain the expected userProperties ", () => {
        expect(mockLastFMHook.playCountByArtist).toBeCalledTimes(1);
        expect(mockLastFMHook.playCountByArtist).toBeCalledWith("niall-byrne");
      });
    });
  });
});
