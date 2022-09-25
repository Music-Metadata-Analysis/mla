import { render } from "@testing-library/react";
import FeedbackDialogue from "../dialogues/feedback.dialogue";
import FeedbackPopUp from "../feedback.popup";
import PopUp from "../popup/popup.component";
import translations from "@locales/main.json";
import settings from "@src/config/popups";
import mockAuthHook, { mockUserProfile } from "@src/hooks/tests/auth.mock.hook";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";
import mockMetricsHook from "@src/hooks/tests/metrics.mock.hook";
import mockUserInterfaceHook from "@src/hooks/tests/ui.mock.hook";

jest.mock("@src/hooks/auth", () => () => mockAuthHook);

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock("@src/hooks/metrics", () => () => mockMetricsHook);

jest.mock("@src/hooks/ui", () => () => mockUserInterfaceHook);

jest.mock("../popup/popup.component", () =>
  jest.fn(() => <div>MockPopup</div>)
);

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
      mockAuthHook.status = "authenticated";
      mockAuthHook.user = mockUserProfile;
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
          expect(call.message).toBe(_t(translations.popups.FeedBack));
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
          expect(call.message).toBe(_t(translations.popups.FeedBack));
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
      mockAuthHook.status = "unauthenticated";
      mockAuthHook.user = null;
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
