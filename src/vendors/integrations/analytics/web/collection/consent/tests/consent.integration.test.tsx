import { render, screen, fireEvent } from "@testing-library/react";
import Cookies from "js-cookie";
import ConsentContainer from "../consent.container";
import { testIDs } from "../consent.identifiers";
import translations from "@locales/main.json";
import { settings } from "@src/config/cookies";
import { mockAnalyticsCollectionHook } from "@src/vendors/integrations/analytics/__mocks__/vendor.mock";
import { mockLocaleVendorHook } from "@src/vendors/integrations/locale/__mocks__/vendor.mock";
import {
  _t,
  MockLocaleVendorUseTranslation,
} from "@src/vendors/integrations/locale/__mocks__/vendor.mock";

jest.mock("@src/vendors/integrations/analytics/vendor");

jest.mock("@src/vendors/integrations/locale/vendor");

jest.mock("@src/vendors/integrations/ui.framework/vendor");

describe("Consent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocaleVendorHook.t.mockImplementation((props) =>
      new MockLocaleVendorUseTranslation("main").t(props)
    );
  });

  const arrange = () => render(<ConsentContainer />);

  describe("when a consent cookie is present", () => {
    beforeEach(() => {
      Cookies.set(settings.consentCookieName, "true");
      arrange();
    });

    it("should hide the banner", () => {
      expect(screen.queryByTestId(testIDs.consentMessageLine1)).toBeNull();
    });

    it("should initialize analytics", () => {
      expect(mockAnalyticsCollectionHook.setup).toBeCalledTimes(1);
    });
  });

  describe("when a consent cookie is NOT present", () => {
    beforeEach(() => {
      Cookies.remove(settings.consentCookieName);
      arrange();
    });

    it("should display the banner", async () => {
      const messageBox1 = await screen.findByTestId(
        testIDs.consentMessageLine1
      );
      const messageBox2 = await screen.findByTestId(
        testIDs.consentMessageLine2
      );
      expect(messageBox1.innerHTML).toBe(_t(translations.analytics.message1));
      expect(messageBox2.innerHTML).toBe(
        `<strong>${_t(translations.analytics.message2)}</strong>`
      );
    });

    it("should display the buttons", async () => {
      expect(
        await screen.findByText(_t(translations.analytics.acceptMessage))
      ).toBeTruthy();
      expect(
        await screen.findByText(_t(translations.analytics.declineMessage))
      ).toBeTruthy();
    });

    describe("when accept is pressed", () => {
      beforeEach(async () => {
        const button = await screen.findByText(
          _t(translations.analytics.acceptMessage)
        );
        fireEvent.click(button);
      });

      it("should set a cookie", () => {
        expect(Cookies.get(settings.consentCookieName)).toBe("true");
      });

      it("should initialize analytics", () => {
        expect(mockAnalyticsCollectionHook.setup).toBeCalledTimes(1);
      });
    });

    describe("when decline is pressed", () => {
      beforeEach(async () => {
        const button = await screen.findByText(
          _t(translations.analytics.declineMessage)
        );
        fireEvent.click(button);
      });

      it("should hide the banner", () => {
        expect(screen.queryByTestId(testIDs.consentMessageLine1)).toBeNull();
      });
    });
  });
});
