import { render } from "@testing-library/react";
import Cookies from "js-cookie";
import Consent from "../consent.component";
import ConsentContainer from "../consent.container";
import translations from "@locales/main.json";
import { settings } from "@src/config/cookies";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { mockAnalyticsCollectionHook } from "@src/vendors/integrations/analytics/__mocks__/vendor.mock";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import {
  mockLocaleVendorHook,
  _t,
  MockLocaleVendorUseTranslation,
} from "@src/vendors/integrations/locale/__mocks__/vendor.mock";

jest.mock("@src/vendors/integrations/analytics/vendor");

jest.mock("@src/vendors/integrations/locale/vendor");

jest.mock("../consent.component", () =>
  require("@fixtures/react/child").createComponent("Consent")
);

describe("ConsentContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocaleVendorHook.t.mockImplementation((props) =>
      new MockLocaleVendorUseTranslation("main").t(props)
    );
  });

  const arrange = () => render(<ConsentContainer />);

  const checkConsentProps = () => {
    it("should render the Consent component with the expected props", () => {
      expect(Consent).toHaveBeenCalledTimes(1);
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

    it("should call the underlying analytics hook during render", () => {
      expect(analyticsVendor.collection.hook).toHaveBeenCalledTimes(1);
      expect(analyticsVendor.collection.hook).toHaveBeenCalledWith(
        analyticsVendor.ClientClass
      );
    });

    it("should initialize analytics", () => {
      expect(mockAnalyticsCollectionHook.setup).toHaveBeenCalledTimes(1);
      expect(mockAnalyticsCollectionHook.setup).toHaveBeenCalledWith();
    });

    checkConsentProps();
  });

  describe("when a consent cookie is NOT present", () => {
    beforeEach(() => {
      Cookies.remove(settings.consentCookieName);

      arrange();
    });

    it("should call the underlying analytics hook during render", () => {
      expect(analyticsVendor.collection.hook).toHaveBeenCalledTimes(1);
      expect(analyticsVendor.collection.hook).toHaveBeenCalledWith(
        analyticsVendor.ClientClass
      );
    });

    it("should NOT initialize analytics", () => {
      expect(mockAnalyticsCollectionHook.setup).toHaveBeenCalledTimes(0);
    });

    checkConsentProps();
  });
});
