import { render } from "@testing-library/react";
import translations from "../../../../public/locales/en/main.json";
import settings from "../../../config/popups";
import mockMetricsHook from "../../../hooks/tests/metrics.mock.hook";
import mockUserInterfaceHook from "../../../hooks/tests/ui.mock.hook";
import FeedbackDialogue from "../dialogues/feedback.dialogue";
import FeedbackPopUp from "../feedback.popup";
import PopUp from "../popup/popup.component";

jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

jest.mock("../popup/popup.component", () =>
  jest.fn(() => <div>MockPopup</div>)
);

jest.mock("../../../hooks/metrics", () => ({
  __esModule: true,
  default: () => mockMetricsHook,
}));

jest.mock("../../../hooks/ui", () => ({
  __esModule: true,
  default: () => mockUserInterfaceHook,
}));

const mockUseSession = jest.fn();

describe("FeedBackPopup", () => {
  const mockPopUpName = "FeedBack";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<FeedbackPopUp />);
  };

  describe("user is logged in", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ data: {}, status: "authenticated" });
    });

    describe("metric count matches a target", () => {
      beforeEach(() => {
        mockMetricsHook.metrics["SearchMetric"] =
          settings.FeedBack.searchMetricCount[0];
      });

      describe("popup state is closed", () => {
        beforeEach(() => {
          mockUserInterfaceHook.popups.status.mockReturnValue(false);
          arrange();
        });

        it("should toggle the PopUp to open", () => {
          expect(mockUserInterfaceHook.popups.open).toBeCalledTimes(1);
          expect(mockUserInterfaceHook.popups.open).toBeCalledWith(
            mockPopUpName
          );
        });
      });

      describe("popup state is open", () => {
        beforeEach(() => {
          mockUserInterfaceHook.popups.status.mockReturnValue(true);
          arrange();
        });

        it("should call the PopUp component", () => {
          expect(PopUp).toBeCalledTimes(1);
          const call = (PopUp as jest.Mock).mock.calls[0][0];
          expect(call.name).toBe(mockPopUpName);
          expect(call.message).toBe(translations.popups.FeedBack);
          expect(call.Component).toBe(FeedbackDialogue);
        });
      });
    });

    describe("metric count does NOT match a target", () => {
      beforeEach(() => {
        mockMetricsHook.metrics["SearchMetric"] = 0;
      });

      describe("popup state is closed", () => {
        beforeEach(() => {
          mockUserInterfaceHook.popups.status.mockReturnValue(false);
          arrange();
        });

        it("should NOT call the PopUp component", () => {
          expect(PopUp).toBeCalledTimes(0);
        });
      });

      describe("popup state is open", () => {
        beforeEach(() => {
          mockUserInterfaceHook.popups.status.mockReturnValue(true);
          arrange();
        });

        it("should call the PopUp component", () => {
          expect(PopUp).toBeCalledTimes(1);
          const call = (PopUp as jest.Mock).mock.calls[0][0];
          expect(call.name).toBe(mockPopUpName);
          expect(call.message).toBe(translations.popups.FeedBack);
          expect(call.Component).toBe(FeedbackDialogue);
        });
      });

      it("should NOT call the PopUp component", () => {
        expect(PopUp).toBeCalledTimes(0);
      });
    });
  });

  describe("user is NOT logged in", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ data: {}, status: "unauthenticated" });
      arrange();
    });

    describe("metric count matches a target", () => {
      beforeEach(() => {
        mockMetricsHook.metrics["SearchMetric"] =
          settings.FeedBack.searchMetricCount[0];
      });

      describe("popup state is closed", () => {
        beforeEach(() => {
          mockUserInterfaceHook.popups.status.mockReturnValue(false);
          arrange();
        });

        it("should NOT toggle the PopUp to open", () => {
          expect(mockUserInterfaceHook.popups.open).toBeCalledTimes(0);
        });
      });

      describe("popup state is open", () => {
        beforeEach(() => {
          mockUserInterfaceHook.popups.status.mockReturnValue(true);
        });

        it("should NOT call the PopUp component", () => {
          expect(PopUp).toBeCalledTimes(0);
        });
      });
    });

    describe("metric count does NOT match a target", () => {
      beforeEach(() => {
        mockMetricsHook.metrics["SearchMetric"] = 0;
      });

      describe("popup state is closed", () => {
        beforeEach(() => {
          mockUserInterfaceHook.popups.status.mockReturnValue(false);
          arrange();
        });

        it("should NOT call the PopUp component", () => {
          expect(PopUp).toBeCalledTimes(0);
        });
      });

      describe("popup state is open", () => {
        beforeEach(() => {
          mockUserInterfaceHook.popups.status.mockReturnValue(true);
          arrange();
        });

        it("should NOT call the PopUp component", () => {
          expect(PopUp).toBeCalledTimes(0);
        });
      });

      it("should NOT call the PopUp component", () => {
        expect(PopUp).toBeCalledTimes(0);
      });
    });
  });
});
