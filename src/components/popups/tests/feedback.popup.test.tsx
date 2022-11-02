import { render } from "@testing-library/react";
import FeedbackDialogue from "../dialogues/feedback.dialogue";
import FeedbackPopUp from "../feedback.popup";
import PopUp from "../popup/popup.component";
import translations from "@locales/main.json";
import settings from "@src/config/popups";
import mockAuthHook, { mockUserProfile } from "@src/hooks/__mocks__/auth.mock";
import { _t } from "@src/hooks/__mocks__/locale.mock";
import mockMetricsHook from "@src/hooks/__mocks__/metrics.mock";
import mockPopUpsHook from "@src/hooks/__mocks__/popups.mock";

jest.mock("@src/hooks/auth");

jest.mock("@src/hooks/locale");

jest.mock("@src/hooks/metrics");

jest.mock("@src/hooks/popups");

jest.mock("../popup/popup.component", () =>
  require("@fixtures/react/child").createComponent("Popup")
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
          mockPopUpsHook.status.mockReturnValue(false);
          arrange();
        });

        it("should toggle the PopUp to open", () => {
          expect(mockPopUpsHook.open).toBeCalledTimes(1);
          expect(mockPopUpsHook.open).toBeCalledWith(mockPopUpName);
        });
      });

      describe("popup state is open", () => {
        beforeEach(() => {
          mockPopUpsHook.status.mockReturnValue(true);
          arrange();
        });

        it("should call the PopUp component", () => {
          expect(PopUp).toBeCalledTimes(1);
          const call = jest.mocked(PopUp).mock.calls[0][0];
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
          mockPopUpsHook.status.mockReturnValue(false);
          arrange();
        });

        it("should NOT call the PopUp component", () => {
          expect(PopUp).toBeCalledTimes(0);
        });
      });

      describe("popup state is open", () => {
        beforeEach(() => {
          mockPopUpsHook.status.mockReturnValue(true);
          arrange();
        });

        it("should call the PopUp component", () => {
          expect(PopUp).toBeCalledTimes(1);
          const call = jest.mocked(PopUp).mock.calls[0][0];
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
          mockPopUpsHook.status.mockReturnValue(false);
          arrange();
        });

        it("should NOT toggle the PopUp to open", () => {
          expect(mockPopUpsHook.open).toBeCalledTimes(0);
        });
      });

      describe("popup state is open", () => {
        beforeEach(() => {
          mockPopUpsHook.status.mockReturnValue(true);
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
          mockPopUpsHook.status.mockReturnValue(false);
          arrange();
        });

        it("should NOT call the PopUp component", () => {
          expect(PopUp).toBeCalledTimes(0);
        });
      });

      describe("popup state is open", () => {
        beforeEach(() => {
          mockPopUpsHook.status.mockReturnValue(true);
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
