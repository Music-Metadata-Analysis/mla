import EventDefinition from "../event.class";
import Events from "../events";

describe("Dynamic Events", () => {
  const checkEvent = (event1: EventDefinition, event2: EventDefinition) => {
    expect(JSON.stringify(event1)).toBe(JSON.stringify(event2));
  };

  describe("Auth", () => {
    describe("HandleLogin", () => {
      it("should generate the expected result", () => {
        const provider = "Test Provider";
        const expected = new EventDefinition({
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
        const title = "BASE REPORT";
        const expected = new EventDefinition({
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
        const expected = new EventDefinition({
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
        const expected = new EventDefinition({
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
        const expected = new EventDefinition({
          category: "LAST.FM",
          label: "DATA: TRACK",
          action: `VIEWED TRACK DETAILS: ${artistName}:${trackName}.`,
        });
        checkEvent(expected, Events.LastFM.TrackViewed(artistName, trackName));
      });
    });
  });
});
