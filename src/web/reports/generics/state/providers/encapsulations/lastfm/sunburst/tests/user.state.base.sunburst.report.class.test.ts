import UserSunBurstReportBaseState from "../user.state.base.sunburst.report.class";
import { InitialState } from "@src/web/reports/generics/state/providers/report.initial";
import type { LastFMUserStatePlayCountByArtistReport } from "@src/types/user/state.types";
import type { LastFMReportClientParamsInterface } from "@src/web/api/lastfm/types/report.client.types";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/web/reports/lastfm/playcount.artists/types/state/aggregate.report.types";

class ConcreteUserSunBurstReportBaseState extends UserSunBurstReportBaseState<
  PlayCountByArtistReportInterface[]
> {
  errorMessage = "Error Message";

  updateWithResponse(
    response: unknown,
    params: LastFMReportClientParamsInterface,
    url: string
  ) {
    mockUpdate(response, url, params);
  }

  getReport() {
    return this.userProperties.data.report
      .playCountByArtist as LastFMAggregateReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }

  getNextStep(params: LastFMReportClientParamsInterface): void {
    mockNextStep(params);
  }

  removeEntity(params: LastFMReportClientParamsInterface): void {
    mockRemove(params);
  }
}

const mockUpdate = jest.fn();
const mockNextStep = jest.fn();
const mockRemove = jest.fn();

describe("UserSunBurstReportBaseState", () => {
  let instance: UserSunBurstReportBaseState<PlayCountByArtistReportInterface[]>;
  let mockUserProperties: LastFMUserStatePlayCountByArtistReport;
  const mockResponse = { mock: "response" };
  const mockParams = { userName: "niall-byrne" };
  const mockUrl = "http://mock/url.com";

  describe("when initialized", () => {
    beforeEach(() => {
      mockUserProperties = JSON.parse(JSON.stringify(InitialState));
      instance = new ConcreteUserSunBurstReportBaseState(mockUserProperties);
    });

    describe("getNextStep", () => {
      beforeEach(() => instance.getNextStep(mockParams));

      it("should call the mock nextStep function as expected", () => {
        expect(mockNextStep).toBeCalledTimes(1);
        expect(mockNextStep).toBeCalledWith(mockParams);
      });
    });

    describe("getReport", () => {
      it("should return the expected value", () => {
        expect(instance.getReport()).toBe(
          instance.userProperties.data.report.playCountByArtist
        );
      });
    });

    describe("getReportContent", () => {
      it("should return the expected value", () => {
        expect(instance.getReportContent()).toBe(
          instance.userProperties.data.report.playCountByArtist?.content
        );
      });
    });

    describe("getReportStatus", () => {
      it("should return the expected value", () => {
        expect(instance.getReportStatus()).toBe(
          instance.userProperties.data.report.playCountByArtist?.status
        );
      });
    });

    describe("getDispatchState", () => {
      it("should return the expected value", () => {
        expect(instance.getDispatchState()).toBe(
          instance.userProperties.data.report
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
        expect(mockUpdate).toBeCalledTimes(1);
        expect(mockUpdate).toBeCalledWith(mockResponse, mockUrl, mockParams);
      });
    });
  });
});
