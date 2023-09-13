import {
  baseReportProperties,
  mockUrls,
} from "./states/lastfm.report.state.data.set";
import LastFMReportBaseStateEncapsulation from "../lastfm.report.encapsulation.base.class";
import type { LastFMImageDataInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

describe("LastFMReportBaseStateEncapsulation", () => {
  let currentState: LastFMReportStateBase;
  let instance: LastFMReportBaseStateEncapsulation;
  let size: LastFMImageDataInterface["size"];

  const resetState = () => {
    currentState = JSON.parse(JSON.stringify(baseReportProperties));
  };

  const arrange = () => {
    instance = new LastFMReportBaseStateEncapsulation(currentState);
  };

  beforeEach(() => {
    resetState();
  });

  describe("with a VALID image size", () => {
    beforeEach(() => (size = "small"));

    describe("getProfileImageUrl", () => {
      beforeEach(() => arrange());

      it("should return the expected url", () => {
        expect(instance.getProfileImageUrl(size)).toBe(mockUrls[1]);
      });
    });
  });

  describe("with a INVALID image size", () => {
    beforeEach(
      () => (size = "not-a-valid_size" as LastFMImageDataInterface["size"])
    );

    describe("getProfileImageUrl", () => {
      beforeEach(() => arrange());

      it("should return the expected url", () => {
        expect(instance.getProfileImageUrl(size)).toBe("");
      });
    });
  });
});
