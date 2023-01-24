import { render } from "@testing-library/react";
import FeedbackPopUpContainer from "../feedback.popup.container";
import FeedbackPopUp from "../popups.components/feedback.popup.component";
import translations from "@locales/main.json";
import settings from "@src/config/popups";
import mockPopUpsControllerHook from "@src/hooks/controllers/__mocks__/popups.controller.hook.mock";
import usePopUpsGenerator from "@src/hooks/ui/popups.generator.hook";
import mockAuthHook, {
  mockUserProfile,
} from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockMetricsHook from "@src/web/metrics/collection/state/hooks/__mocks__/metrics.hook.mock";

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/hooks/controllers/popups.controller.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/metrics/collection/state/hooks/metrics.hook");

jest.mock("@src/hooks/ui/popups.generator.hook");

jest.mock("../popups.components/feedback.popup.component", () =>
  require("@fixtures/react/child").createComponent("FeedbackPopUp")
);

describe("FeedbackPopUpContainer", () => {
  const mockPopUpName = "FeedBack";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<FeedbackPopUpContainer />);
  };

  const checkPopUpTogglesOpen = () => {
    it("should toggle the PopUp to open", () => {
      expect(mockPopUpsControllerHook.open).toBeCalledTimes(1);
      expect(mockPopUpsControllerHook.open).toBeCalledWith(mockPopUpName);
    });
  };

  const checkPopUpDoesNotToggleOpen = () => {
    it("should NOT toggle the PopUp to open", () => {
      expect(mockPopUpsControllerHook.open).toBeCalledTimes(0);
    });
  };

  const checkPopUpGeneratorRender = () => {
    it("should generate the PopUp with the expected props", () => {
      expect(usePopUpsGenerator).toBeCalledTimes(1);
      expect(usePopUpsGenerator).toBeCalledWith({
        component: FeedbackPopUp,
        message: _t(translations.popups[mockPopUpName]),
        name: mockPopUpName,
      });
    });
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

        arrange();
      });

      checkPopUpGeneratorRender();
      checkPopUpTogglesOpen();
    });

    describe("metric count does NOT match a target", () => {
      beforeEach(() => {
        mockMetricsHook.metrics["SearchMetric"] = 0;

        arrange();
      });

      checkPopUpGeneratorRender();
      checkPopUpDoesNotToggleOpen();
    });
  });

  describe("user is NOT logged in", () => {
    beforeEach(() => {
      mockAuthHook.status = "unauthenticated";
      mockAuthHook.user = null;
    });

    describe("metric count matches a target", () => {
      beforeEach(() => {
        mockMetricsHook.metrics["SearchMetric"] =
          settings.FeedBack.searchMetricCount[0];

        arrange();
      });

      checkPopUpGeneratorRender();
      checkPopUpDoesNotToggleOpen();
    });

    describe("metric count does NOT match a target", () => {
      beforeEach(() => {
        mockMetricsHook.metrics["SearchMetric"] = 0;

        arrange();
      });

      checkPopUpGeneratorRender();
      checkPopUpDoesNotToggleOpen();
    });
  });
});
