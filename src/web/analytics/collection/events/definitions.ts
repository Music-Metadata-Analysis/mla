import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import type {
  IntegrationRequestType,
  SunBurstEntityTypes,
} from "@src/web/analytics/collection/types/analytics.types";

const Events = {
  Auth: {
    CloseModal: new analyticsVendor.EventDefinition({
      category: "AUTH",
      label: "MODAL",
      action: "AUTHENTICATION MODAL WAS CLOSED.",
    }),
    HandleLogin: (provider: string) =>
      new analyticsVendor.EventDefinition({
        category: "AUTH",
        label: "LOGIN",
        action: `LOGIN FLOW STARTED USING PROVIDER: ${provider}.`,
      }),
    Logout: new analyticsVendor.EventDefinition({
      category: "AUTH",
      label: "LOGOUT",
      action: `LOGOUT FLOW STARTED.`,
    }),
    OpenModal: new analyticsVendor.EventDefinition({
      category: "AUTH",
      label: "MODAL",
      action: "AUTHENTICATION MODAL WAS OPENED.",
    }),
  },
  LastFM: {
    ReportPresented: (title: IntegrationRequestType) =>
      new analyticsVendor.EventDefinition({
        category: "LAST.FM",
        label: "REPORT",
        action: `REPORT PRESENTED TO USER: ${title}.`,
      }),
    AlbumViewed: (artistName: string, albumName: string) =>
      new analyticsVendor.EventDefinition({
        category: "LAST.FM",
        label: "DATA: ALBUM",
        action: `VIEWED ALBUM DETAILS: ${artistName}:${albumName}.`,
      }),
    ArtistViewed: (artistName: string) =>
      new analyticsVendor.EventDefinition({
        category: "LAST.FM",
        label: "DATA: ARTIST",
        action: `VIEWED ARTIST DETAILS: ${artistName}.`,
      }),
    TrackViewed: (artistName: string, trackName: string) =>
      new analyticsVendor.EventDefinition({
        category: "LAST.FM",
        label: "DATA: TRACK",
        action: `VIEWED TRACK DETAILS: ${artistName}:${trackName}.`,
      }),
    SunBurstNodeSelected: (entity: SunBurstEntityTypes, name: string) =>
      new analyticsVendor.EventDefinition({
        category: "LAST.FM",
        label: `DATA: ${entity}`,
        action: `VIEWED ${entity} DETAILS: ${name}.`,
      }),
  },
  General: {
    Error: new analyticsVendor.EventDefinition({
      category: "MAIN",
      label: "ERROR",
      action: "UNSPECIFIED ERROR WAS CAUGHT BY THE ERROR BOUNDARY.",
    }),
    Test: new analyticsVendor.EventDefinition({
      category: "TEST",
      label: "TEST",
      action: "TEST EVENT WAS PROCESSED.",
    }),
  },
};

export default Events;
