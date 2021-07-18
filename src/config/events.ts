import EventDefinition from "../providers/analytics/event.class";

const Events = {
  LastFM: {
    ErrorAlbumsReport: new EventDefinition({
      category: "LASTFM",
      label: "ERROR",
      action: "Error when creating a user's top albums report.",
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
