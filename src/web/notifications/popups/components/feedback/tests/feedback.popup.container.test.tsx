import { render } from "@testing-library/react";
import { useEffect } from "react";
import FeedbackPopUp from "../feedback.popup.component";
import FeedbackPopUpContainer from "../feedback.popup.container";
import translations from "@locales/main.json";
import settings from "@src/config/popups";
import mockAuthHook, {
  mockUserProfile,
} from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockMetricsHook from "@src/web/metrics/collection/state/hooks/__mocks__/metrics.hook.mock";
import mockPopUpsControllerHook from "@src/web/notifications/popups/state/controllers/__mocks__/popups.controller.hook.mock";
import usePopUpsGenerator from "@src/web/notifications/popups/state/controllers/popups.generator.hook";
import useNotOnMountEffect from "@src/web/ui/generics/state/hooks/not.on.mount.hook";

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock(
  "@src/web/notifications/popups/state/controllers/popups.controller.hook"
);

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/metrics/collection/state/hooks/metrics.hook");

jest.mock(
  "@src/web/notifications/popups/state/controllers/popups.generator.hook"
);

jest.mock("@src/web/ui/generics/state/hooks/not.on.mount.hook");

jest.mock("../feedback.popup.component", () =>
  require("@fixtures/react/child").createComponent("FeedbackPopUp")
);

describe("FeedbackPopUpContainer", () => {
  const mockPopUpName = "FeedBack";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const WrapperComponent = () => {
    return <FeedbackPopUpContainer />;
  };

  const arrange = () => {
    render(<WrapperComponent />);
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

  describe("when on the first render", () => {
    beforeEach(() => {
      jest.mocked(useNotOnMountEffect).mockRestore();
    });

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

  describe("when on a subsequent render", () => {
    beforeEach(() => {
      jest
        .mocked(useNotOnMountEffect)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        .mockImplementation((props, deps) => useEffect(props, deps));
    });

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
});
