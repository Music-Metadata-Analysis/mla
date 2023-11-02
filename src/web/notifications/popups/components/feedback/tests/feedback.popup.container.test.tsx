import { render } from "@testing-library/react";
import { FC, useEffect } from "react";
import { renderToString } from "react-dom/server";
import FeedbackPopUp from "../feedback.popup.component";
import FeedbackPopUpContainer from "../feedback.popup.container";
import translations from "@locales/main.json";
import settings from "@src/config/popups";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockAuthHook, {
  mockUserProfile,
} from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockMetricsHook from "@src/web/metrics/collection/state/hooks/__mocks__/metrics.hook.mock";
import mockPopUpsControllerHook from "@src/web/notifications/popups/state/controllers/__mocks__/popups.controller.hook.mock";
import usePopUpsGenerator from "@src/web/notifications/popups/state/controllers/popups.generator.hook";
import SVSIcon from "@src/web/ui/generics/components/icons/svs/svs.icon.component";
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

jest.mock("@src/web/ui/generics/components/icons/svs/svs.icon.component", () =>
  require("@fixtures/react/child").createComponent("SVSIcon")
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

  const checkIconRender = () => {
    describe("when the passed Icon function is rendered", () => {
      let PassedIcon: FC;

      beforeEach(() => {
        const call = jest.mocked(usePopUpsGenerator).mock.calls[0][0];
        PassedIcon = call.subComponents.Icon;
        renderToString(<PassedIcon />);
      });

      it("should call the underlying SVSIcon component as exoected", () => {
        checkMockCall(SVSIcon, {
          altText: _t(translations.altText.svs),
        });
      });
    });
  };

  const checkPopUpTogglesOpen = () => {
    it("should toggle the PopUp to open", () => {
      expect(mockPopUpsControllerHook.open).toHaveBeenCalledTimes(1);
      expect(mockPopUpsControllerHook.open).toHaveBeenCalledWith(mockPopUpName);
    });
  };

  const checkPopUpDoesNotToggleOpen = () => {
    it("should NOT toggle the PopUp to open", () => {
      expect(mockPopUpsControllerHook.open).toHaveBeenCalledTimes(0);
    });
  };

  const checkPopUpGeneratorRender = () => {
    it("should generate the PopUp with the expected props", () => {
      expect(usePopUpsGenerator).toHaveBeenCalledTimes(1);
      const call = jest.mocked(usePopUpsGenerator).mock.calls[0][0];
      expect(call.component).toBe(FeedbackPopUp);
      expect(call.message).toBe(_t(translations.popups[mockPopUpName]));
      expect(call.name).toBe(mockPopUpName);
      expect(typeof call.subComponents.Icon).toStrictEqual("function");
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
        checkIconRender();
      });

      describe("metric count does NOT match a target", () => {
        beforeEach(() => {
          mockMetricsHook.metrics["SearchMetric"] = 0;

          arrange();
        });

        checkPopUpGeneratorRender();
        checkPopUpDoesNotToggleOpen();
        checkIconRender();
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
        checkIconRender();
      });

      describe("metric count does NOT match a target", () => {
        beforeEach(() => {
          mockMetricsHook.metrics["SearchMetric"] = 0;

          arrange();
        });

        checkPopUpGeneratorRender();
        checkPopUpDoesNotToggleOpen();
        checkIconRender();
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
        checkIconRender();
      });

      describe("metric count does NOT match a target", () => {
        beforeEach(() => {
          mockMetricsHook.metrics["SearchMetric"] = 0;

          arrange();
        });

        checkPopUpGeneratorRender();
        checkPopUpDoesNotToggleOpen();
        checkIconRender();
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
        checkIconRender();
      });

      describe("metric count does NOT match a target", () => {
        beforeEach(() => {
          mockMetricsHook.metrics["SearchMetric"] = 0;

          arrange();
        });

        checkPopUpGeneratorRender();
        checkPopUpDoesNotToggleOpen();
        checkIconRender();
      });
    });
  });
});
