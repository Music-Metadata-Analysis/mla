import EventDefinition from "./event.class";
import type { ReportType } from "../types/analytics.types";

const Events = {
  LastFM: {
    ReportPresented: (title: ReportType) =>
      new EventDefinition({
        category: "LAST.FM",
        label: "REPORT",
        action: `${title}: Presented report to user.`,
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
