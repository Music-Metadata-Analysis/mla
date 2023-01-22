import Events from "../definitions";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import type { AnalyticsEventDefinitionInterface } from "@src/web/analytics/collection/events/types/event.types";

describe("Dynamic Events", () => {
  const checkEvent = (
    event1: AnalyticsEventDefinitionInterface,
    event2: AnalyticsEventDefinitionInterface
  ) => {
    expect(JSON.stringify(event1)).toBe(JSON.stringify(event2));
  };

  describe("Auth", () => {
    describe("HandleLogin", () => {
      it("should generate the expected result", () => {
        const provider = "Test Provider";
        const expected = new analyticsVendor.EventDefinition({
          category: "AUTH",
          label: "LOGIN",
          action: `LOGIN FLOW STARTED USING PROVIDER: ${provider}.`,
        });
        checkEvent(expected, Events.Auth.HandleLogin(provider));
      });
    });
  });

  describe("LastFM", () => {
    describe("ReportPresented", () => {
      it("should generate the expected result", () => {
        const title = "BASE";
        const expected = new analyticsVendor.EventDefinition({
          category: "LAST.FM",
          label: "REPORT",
          action: `REPORT PRESENTED TO USER: ${title}.`,
        });
        checkEvent(expected, Events.LastFM.ReportPresented(title));
      });
    });

    describe("AlbumViewed", () => {
      it("should generate the expected result", () => {
        const artistName = "Test Artist";
        const albumName = "Test Album";
        const expected = new analyticsVendor.EventDefinition({
          category: "LAST.FM",
          label: "DATA: ALBUM",
          action: `VIEWED ALBUM DETAILS: ${artistName}:${albumName}.`,
        });
        checkEvent(expected, Events.LastFM.AlbumViewed(artistName, albumName));
      });
    });

    describe("ArtistViewed", () => {
      it("should generate the expected result", () => {
        const artistName = "Test Artist";
        const expected = new analyticsVendor.EventDefinition({
          category: "LAST.FM",
          label: "DATA: ARTIST",
          action: `VIEWED ARTIST DETAILS: ${artistName}.`,
        });
        checkEvent(expected, Events.LastFM.ArtistViewed(artistName));
      });
    });

    describe("TrackViewed", () => {
      it("should generate the expected result", () => {
        const artistName = "Test Artist";
        const trackName = "Test Track";
        const expected = new analyticsVendor.EventDefinition({
          category: "LAST.FM",
          label: "DATA: TRACK",
          action: `VIEWED TRACK DETAILS: ${artistName}:${trackName}.`,
        });
        checkEvent(expected, Events.LastFM.TrackViewed(artistName, trackName));
      });
    });

    describe("SunBurstNodeSelected", () => {
      it("should generate the expected result", () => {
        const entityName = "Test Track";
        const entityType = "UNKNOWN";
        const expected = new analyticsVendor.EventDefinition({
          category: "LAST.FM",
          label: `DATA: ${entityType}`,
          action: `VIEWED ${entityType} DETAILS: ${entityName}.`,
        });
        checkEvent(
          expected,
          Events.LastFM.SunBurstNodeSelected("UNKNOWN", "Test Track")
        );
      });
    });
  });
});
