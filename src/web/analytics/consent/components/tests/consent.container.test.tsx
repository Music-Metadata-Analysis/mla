import { render } from "@testing-library/react";
import Cookies from "js-cookie";
import Consent from "../consent.component";
import ConsentContainer from "../consent.container";
import translations from "@locales/main.json";
import { settings } from "@src/config/cookies";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("../consent.component", () =>
  require("@fixtures/react/child").createComponent("Consent")
);

describe("ConsentContainer", () => {
  beforeEach(() => jest.clearAllMocks());

  const arrange = () => render(<ConsentContainer />);

  const checkConsentProps = () => {
    it("should render the Consent component with the expected props", () => {
      expect(Consent).toBeCalledTimes(1);
      checkMockCall(
        Consent,
        {
          acceptButtonText: _t(translations.analytics.acceptMessage),
          declineButtonText: _t(translations.analytics.declineMessage),
          consentMessageLine1Text: _t(translations.analytics.message1),
          consentMessageLine2Text: _t(translations.analytics.message2),
        },
        0,
        ["onAccept"]
      );
    });
  };

  describe("when a consent cookie is present", () => {
    beforeEach(() => {
      Cookies.set(settings.consentCookieName, "true");

      arrange();
    });

    it("should initialize analytics", () => {
      expect(mockAnalyticsHook.setup).toBeCalledTimes(1);
      expect(mockAnalyticsHook.setup).toBeCalledWith();
    });

    checkConsentProps();
  });

  describe("when a consent cookie is NOT present", () => {
    beforeEach(() => {
      Cookies.remove(settings.consentCookieName);

      arrange();
    });

    it("should NOT initialize analytics", () => {
      expect(mockAnalyticsHook.setup).toBeCalledTimes(0);
    });

    checkConsentProps();
  });
});
