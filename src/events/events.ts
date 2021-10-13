import EventDefinition from "./event.class";
import type { ReportType } from "../types/analytics.types";

const Events = {
  LastFM: {
    ReportPresented: (title: ReportType) =>
      new EventDefinition({
        category: "LAST.FM",
        label: "REPORT",
        action: `REPORT PRESENTED TO USER: ${title}.`,
      }),
    AlbumViewed: (artistName: string, albumName: string) =>
      new EventDefinition({
        category: "LAST.FM",
        label: "DATA: ALBUM",
        action: `VIEWED ALBUM DETAILS: ${artistName}:${albumName}.`,
      }),
    ArtistViewed: (artistName: string) =>
      new EventDefinition({
        category: "LAST.FM",
        label: "DATA: ARTIST",
        action: `VIEWED ARTIST DETAILS: ${artistName}.`,
      }),
  },
  General: {
    Error: new EventDefinition({
      category: "MAIN",
      label: "ERROR",
      action: "Unspecified error was caught by the error boundary.",
    }),
    Contact: new EventDefinition({
      category: "MAIN",
      label: "CONTACT",
      action: "Pressed contact button for external site.",
    }),
    Test: new EventDefinition({
      category: "TEST",
      label: "TEST",
      action: "test event was processed.",
    }),
  },
};

export default Events;
