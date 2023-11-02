import ConcreteLastFMReportSunBurstStateEncapsulation, {
  mockNextStep,
  mockUpdate,
} from "./implementations/concrete.lastfm.report.encapsulation.sunburst.class";
import { InitialState } from "@src/web/reports/generics/state/providers/report.initial";
import type LastFMReportSunBurstBaseStateEncapsulation from "../lastfm.report.encapsulation.sunburst.base.class";
import type { PlayCountByArtistReportInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.playcount.by.artist.report.types";
import type { LastFMReportStatePlayCountByArtistReport } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

describe("LastFMReportSunBurstBaseStateEncapsulation", () => {
  let instance: LastFMReportSunBurstBaseStateEncapsulation<
    PlayCountByArtistReportInterface[]
  >;
  let mockReportProperties: LastFMReportStatePlayCountByArtistReport;
  const mockResponse = { mock: "response" };
  const mockParams = { userName: "niall-byrne" };
  const mockUrl = "http://mock/url.com";

  describe("when initialized", () => {
    beforeEach(() => {
      mockReportProperties = JSON.parse(JSON.stringify(InitialState));
      instance = new ConcreteLastFMReportSunBurstStateEncapsulation(
        mockReportProperties
      );
    });

    describe("getNextStep", () => {
      beforeEach(() => instance.getNextStep(mockParams));

      it("should call the mock nextStep function as expected", () => {
        expect(mockNextStep).toHaveBeenCalledTimes(1);
        expect(mockNextStep).toHaveBeenCalledWith(mockParams);
      });
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.reportProperties.data.report.playCountByArtist
        );
      });
    });

    describe("getReportContent", () => {
      it("should return the expected value", () => {
        expect(instance.getReportContent()).toBe(
          instance.reportProperties.data.report.playCountByArtist?.content
        );
      });
    });

    describe("getReportStatus", () => {
      it("should return the expected value", () => {
        expect(instance.getReportStatus()).toBe(
          instance.reportProperties.data.report.playCountByArtist?.status
        );
      });
    });

    describe("getDispatchState", () => {
      it("should return the expected value", () => {
        expect(instance.getDispatchState()).toBe(
          instance.reportProperties.data.report
        );
      });
    });

    describe("throwError", () => {
      it("should throw an error", () => {
        const test = () => instance.throwError();
        expect(test).toThrow(instance.errorMessage);
      });
    });

    describe("updateWithResponse", () => {
      beforeEach(() =>
        instance.updateWithResponse(mockResponse, mockParams, mockUrl)
      );

      it("should call the mock update function as expected", () => {
        expect(mockUpdate).toHaveBeenCalledTimes(1);
        expect(mockUpdate).toHaveBeenCalledWith(
          mockResponse,
          mockUrl,
          mockParams
        );
      });
    });
  });
});
