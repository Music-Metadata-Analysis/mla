import EventDefinition from "./event.class";

const Events = {
  LastFM: {
    Top20Albums: {
      ReportPresented: new EventDefinition({
        category: "LASTFM",
        label: "REPORT",
        action: "TOP20 ALBUMS: Presented report to user.",
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
