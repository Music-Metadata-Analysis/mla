import {
  MockQueryClass,
  MockDrawerComponent,
} from "./implementations/concrete.sunburst.query.class";
import SunBurstBaseQuery from "../sunburst.query.base.class";
import MockStage2Report from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.stage.2.json";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import SunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import MockCompleteReport1 from "@src/web/reports/lastfm/generics/components/report.component/sunburst/translator/tests/states/state.data.set.1.json";
import SunBurstStateToChartDataTranslator from "@src/web/reports/lastfm/generics/components/report.component/sunburst/translator/translator.class";
import ConcreteLastFMReportSunBurstStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/tests/implementations/concrete.lastfm.report.encapsulation.sunburst.class";
import type { SunBurstData } from "@src/contracts/api/types/services/generics/aggregates/generic.sunburst.types";
import type {
  LastFMAggregateReportResponseInterface,
  LastFMAggregateReportOperationType,
} from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.playcount.by.artist.report.types";
import type { d3Node } from "@src/web/reports/generics/types/state/charts/sunburst.types";
import type { LastFMSunBurstDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/sunburst.types";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";
import type { BillBoardProgressBarDetails } from "@src/web/ui/generics/components/billboard/billboard.progress.bar/billboard.progress.bar.component";
import type { FC } from "react";

jest.mock(
  "@src/web/reports/lastfm/generics/components/report.component/sunburst/translator/translator.class"
);

describe(SunBurstBaseQuery.name, () => {
  let instance: SunBurstBaseQuery<ConcreteLastFMReportSunBurstStateEncapsulation>;
  let mockReportState: LastFMReportStateBase;

  const mockT = new MockUseTranslation("sunburst").t;
  const mockTranslatedRemainderKey = "mockTranslatedRemainderKey";

  describe("When instantiated with a concrete implementation", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      instance = new MockQueryClass();
      mockReportState = JSON.parse(JSON.stringify(MockStage2Report));
    });

    const getReportState = () =>
      mockReportState.data.report
        .playCountByArtist as LastFMAggregateReportResponseInterface<
        PlayCountByArtistReportInterface[]
      >;

    const getReportStateOperation = () =>
      getReportState().status.operation as LastFMAggregateReportOperationType;

    describe("getDrawerComponent", () => {
      let received: FC<LastFMSunBurstDrawerInterface>;

      beforeEach(() => (received = instance.getDrawerComponent()));

      it("should return the expected drawer component", () => {
        expect(received).toBe(MockDrawerComponent);
      });
    });

    describe("getEncapsulatedNode", () => {
      let received: SunBurstNodeAbstractBase;
      const mockNode = {
        data: { name: "mockNode", entity: "unknown" },
      } as d3Node;

      beforeEach(() => (received = instance.getEncapsulatedNode(mockNode)));

      it("should return an instance of expected encapsulation class", () => {
        expect(received).toBeInstanceOf(SunBurstNodeAbstractBase);
      });

      it("should return the the correct encapsulated node", () => {
        expect(received.getNode()).toBe(mockNode);
      });
    });

    describe("getEncapsulatedReportState", () => {
      let received: ConcreteLastFMReportSunBurstStateEncapsulation;

      beforeEach(
        () => (received = instance.getEncapsulatedReportState(mockReportState))
      );

      it("should be an instance of PlayCountByArtistState", () => {
        expect(received).toBeInstanceOf(
          ConcreteLastFMReportSunBurstStateEncapsulation
        );
      });

      it("should contain the expected reportProperties ", () => {
        expect(received.reportProperties).toStrictEqual(mockReportState);
      });
    });

    describe("getEntities", () => {
      let received: Array<SunBurstData["entity"]>;

      beforeEach(() => (received = instance.getEntities()));

      it("should return the entityKeys list", () => {
        expect(received).toStrictEqual(["artists", "albums", "tracks"]);
      });
    });

    describe("getEntityLeaf", () => {
      let received: SunBurstData["entity"];

      beforeEach(() => (received = instance.getEntityLeaf()));

      it("should return the last entity in the entityKeys list", () => {
        expect(received).toBe("tracks");
      });
    });

    describe("getEntityTopLevel", () => {
      let received: SunBurstData["entity"];

      beforeEach(() => (received = instance.getEntityTopLevel()));

      it("should return the first entity in the entityKeys list", () => {
        expect(received).toBe("artists");
      });
    });

    describe("getProgressPercentage", () => {
      let received: number;

      describe("with total steps as 0", () => {
        beforeEach(() => {
          getReportState().status.complete = false;
          getReportState().status.steps_total = 0;
          getReportState().status.steps_complete = 0;
          received = instance.getProgressPercentage(mockReportState);
        });

        it("should equal 0", () => {
          expect(received).toBe(0);
        });
      });

      describe("with total steps as 50, and completed as 25", () => {
        beforeEach(() => {
          getReportState().status.complete = false;
          getReportState().status.steps_total = 50;
          getReportState().status.steps_complete = 25;
          received = instance.getProgressPercentage(mockReportState);
        });

        it("should equal 50", () => {
          expect(received).toBe(50);
        });
      });

      describe("with the report marked as complete", () => {
        beforeEach(() => {
          getReportState().status.complete = true;
          received = instance.getProgressPercentage(mockReportState);
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
          delete getReportState().status.operation;
          received = instance.getProgressDetails(mockReportState, mockT);
        });

        it("should return the expected details", () => {
          expect(received.resource).toBe("");
          expect(received.type).toBe("");
        });
      });

      describe("with valid operational details attached to the user state", () => {
        beforeEach(() => {
          getReportState().status.complete = false;
          getReportStateOperation().type = "Top Artists";
          getReportStateOperation().resource = "The Cure";
          received = instance.getProgressDetails(mockReportState, mockT);
        });

        it("should return the expected details", () => {
          expect(received.resource).toBe(getReportStateOperation().resource);
          expect(received.type).toBe(
            mockT(`detailTypes.${getReportStateOperation().type}`)
          );
        });
      });
    });

    describe("getSunBurstData", () => {
      let result: unknown;
      let mockConvert: jest.SpyInstance;

      beforeEach(() => {
        mockConvert = jest.spyOn(
          SunBurstStateToChartDataTranslator.prototype,
          "convert"
        );
      });

      describe("when given a finished report", () => {
        beforeEach(() => {
          mockConvert.mockReturnValueOnce({ mock: "return_value" });
          result = instance.getSunBurstData(
            MockCompleteReport1 as LastFMReportStateBase,
            "Top Artists",
            mockTranslatedRemainderKey
          );
        });

        it("should instantiate the SunBurstDataTranslator class", () => {
          expect(SunBurstStateToChartDataTranslator).toHaveBeenCalledTimes(1);
          expect(SunBurstStateToChartDataTranslator).toHaveBeenCalledWith(
            ["artists", "albums", "tracks"],
            mockTranslatedRemainderKey
          );
        });

        it("should call the convert method of the sunBurstDataTranslator class", () => {
          expect(mockConvert).toHaveBeenCalledTimes(1);
          expect(mockConvert).toHaveBeenCalledWith(
            {
              children: [],
              entity: "root",
              name: "Top Artists",
              value: MockCompleteReport1.data.report.playcount,
            },
            instance.getReportData(MockCompleteReport1 as LastFMReportStateBase)
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
          mockReportState.inProgress = false;
        });

        describe("when the report is complete", () => {
          beforeEach(() => {
            getReportState().status.complete = true;
          });

          describe("when the report is not ready", () => {
            beforeEach(() => {
              mockReportState.ready = false;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockReportState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockReportState.error = null;
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(true);
              });
            });
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockReportState.ready = true;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockReportState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockReportState.error = null;
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return true", () => {
                expect(received).toBe(false);
              });
            });
          });
        });

        describe("when the report is NOT complete", () => {
          beforeEach(() => {
            getReportState().status.complete = false;
          });

          describe("when the report is not ready", () => {
            beforeEach(() => {
              mockReportState.ready = false;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockReportState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockReportState.error = null;
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockReportState.ready = true;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockReportState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockReportState.error = null;
                received = instance.queryIsDataReady(mockReportState);
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
          mockReportState.inProgress = true;
        });

        describe("when the report is complete", () => {
          beforeEach(() => {
            getReportState().status.complete = true;
          });

          describe("when the report is not ready", () => {
            beforeEach(() => {
              mockReportState.ready = false;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockReportState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockReportState.error = null;
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockReportState.ready = true;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockReportState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockReportState.error = null;
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return true", () => {
                expect(received).toBe(false);
              });
            });
          });
        });

        describe("when the report is NOT complete", () => {
          beforeEach(() => {
            getReportState().status.complete = false;
          });

          describe("when the report is not ready", () => {
            beforeEach(() => {
              mockReportState.ready = false;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockReportState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockReportState.error = null;
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockReportState.ready = true;
            });

            describe("when the report has an error", () => {
              beforeEach(() => {
                mockReportState.error = "FailureFetch";
                received = instance.queryIsDataReady(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report has NO error", () => {
              beforeEach(() => {
                mockReportState.error = null;
                received = instance.queryIsDataReady(mockReportState);
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
            mockReportState.inProgress = true;
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockReportState.ready = true;
            });

            describe("when the report is complete", () => {
              beforeEach(() => {
                getReportState().status.complete = true;
                received = instance.queryIsResumable(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report is NOT complete", () => {
              beforeEach(() => {
                getReportState().status.complete = false;
                received = instance.queryIsResumable(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });

          describe("when the report is NOT ready", () => {
            beforeEach(() => {
              mockReportState.ready = false;
            });

            describe("when the report is complete", () => {
              beforeEach(() => {
                getReportState().status.complete = true;
                received = instance.queryIsResumable(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report is NOT complete", () => {
              beforeEach(() => {
                getReportState().status.complete = false;
                received = instance.queryIsResumable(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });
        });

        describe("when the report is NOT in progress", () => {
          beforeEach(() => {
            mockReportState.inProgress = false;
          });

          describe("when the report is ready", () => {
            beforeEach(() => {
              mockReportState.ready = true;
            });

            describe("when the report is complete", () => {
              beforeEach(() => {
                getReportState().status.complete = true;
                received = instance.queryIsResumable(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report is NOT complete", () => {
              beforeEach(() => {
                getReportState().status.complete = false;
                received = instance.queryIsResumable(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });
          });

          describe("when the report is NOT ready", () => {
            beforeEach(() => {
              mockReportState.ready = false;
            });

            describe("when the report is complete", () => {
              beforeEach(() => {
                getReportState().status.complete = true;
                received = instance.queryIsResumable(mockReportState);
              });

              it("should return false", () => {
                expect(received).toBe(false);
              });
            });

            describe("when the report is NOT complete", () => {
              beforeEach(() => {
                getReportState().status.complete = false;
                received = instance.queryIsResumable(mockReportState);
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
          mockReportState.error = null;
        });

        truthTable(true);
      });

      describe("when there is an TimeoutFetch error", () => {
        beforeEach(() => {
          mockReportState.error = "TimeoutFetch";
        });

        truthTable(true);
      });

      describe("when there is an DataPoint error", () => {
        beforeEach(() => {
          mockReportState.error = "DataPointFailureFetch";
        });

        truthTable(true);
      });

      describe("when there some other error", () => {
        beforeEach(() => {
          mockReportState.error = "NotFoundFetch";
        });

        truthTable(false);
      });
    });

    describe("queryUserHasNoData", () => {
      let received: boolean;

      const truthTable = (mutableParam1: boolean, mutableParam2: boolean) => {
        describe("when there is a username", () => {
          beforeEach(() => (mockReportState.userName = "niall-byrne"));

          describe("when there is content", () => {
            beforeEach(() => {
              getReportState().content = [
                { name: "The Cure", playcount: 0, albums: [], fetched: false },
              ];
              received = instance.queryUserHasNoData(mockReportState);
            });

            it(`should return ${!mutableParam1}`, () => {
              expect(received).toBe(!mutableParam1);
            });
          });

          describe("when there is NOT content", () => {
            beforeEach(() => {
              getReportState().content = [];
              received = instance.queryUserHasNoData(mockReportState);
            });

            it(`should return ${!mutableParam2}`, () => {
              expect(received).toBe(!mutableParam2);
            });
          });
        });

        describe("when there is NOT a username", () => {
          beforeEach(() => (mockReportState.userName = null));

          describe("when there is content", () => {
            beforeEach(() => {
              getReportState().content = [
                { name: "The Cure", playcount: 0, albums: [], fetched: false },
              ];
              received = instance.queryUserHasNoData(mockReportState);
            });

            it("should return false", () => {
              expect(received).toBe(false);
            });
          });

          describe("when there is NOT content", () => {
            beforeEach(() => {
              getReportState().content = [];
              received = instance.queryUserHasNoData(mockReportState);
            });

            it("should return false", () => {
              expect(received).toBe(false);
            });
          });
        });
      };

      describe("when the report is ready", () => {
        beforeEach(() => (mockReportState.ready = true));

        truthTable(true, false);
      });

      describe("when the report is NOT ready", () => {
        beforeEach(() => (mockReportState.ready = false));

        truthTable(true, true);
      });
    });

    describe("getReportData", () => {
      let received: LastFMAggregateReportResponseInterface<unknown[]>;

      beforeEach(() => (received = instance.getReportData(mockReportState)));

      it("should contain the expected reportProperties ", () => {
        expect(received).toStrictEqual(
          mockReportState.data.report.playCountByArtist
        );
      });
    });
  });
});
