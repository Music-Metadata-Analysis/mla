import EventDefinition from "./event.class";

const Events = {
  LastFM: {
    Top20Albums: {
      ErrorAlbumsReport: new EventDefinition({
        category: "LASTFM",
        label: "ERROR",
        action: "TOP20 ALBUMS: Unable to create a report.",
      }),
      NotFound: new EventDefinition({
        category: "LASTFM",
        label: "ERROR",
        action: "TOP20 ALBUMS: Request was made for an unknown username.",
      }),
      Ratelimited: new EventDefinition({
        category: "LASTFM",
        label: "ERROR",
        action: "TOP20 ALBUMS: Request was ratelimited by LAST.FM.",
      }),
      RequestAlbumsReport: new EventDefinition({
        category: "LASTFM",
        label: "REQUEST",
        action: "TOP20 ALBUMS: Request was sent to LAST.FM.",
      }),
      SuccessAlbumsReport: new EventDefinition({
        category: "LASTFM",
        label: "RESPONSE",
        action: "TOP20 ALBUMS: Received report from LAST.FM.",
      }),
    },
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
