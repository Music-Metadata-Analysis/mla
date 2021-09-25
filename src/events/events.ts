import EventDefinition from "./event.class";

const Events = {
  LastFM: {
    ErrorAlbumsReport: new EventDefinition({
      category: "LASTFM",
      label: "ERROR",
      action: "Error when creating a user's top albums report.",
    }),
    NotFound: new EventDefinition({
      category: "LASTFM",
      label: "ERROR",
      action: "Request was made for an unknown username.",
    }),
    Ratelimited: new EventDefinition({
      category: "LASTFM",
      label: "ERROR",
      action: "Request was ratelimited by Last FM.",
    }),
    RequestAlbumsReport: new EventDefinition({
      category: "LASTFM",
      label: "REQUEST",
      action: "A user requested a top album's report.",
    }),
    SuccessAlbumsReport: new EventDefinition({
      category: "LASTFM",
      label: "REPORT_CREATED",
      action: "Created a user's top albums report.",
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
