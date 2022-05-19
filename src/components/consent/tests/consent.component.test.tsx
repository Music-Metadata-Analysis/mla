import { render, screen, fireEvent } from "@testing-library/react";
import Cookies from "js-cookie";
import CookieConsent from "react-cookie-consent";
import translations from "../../../../public/locales/en/main.json";
import { settings } from "../../../config/cookies";
import mockAnalyticsHook from "../../../hooks/tests/analytics.mock.hook";
import mockColourHook from "../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import Consent, { testIDs } from "../consent.component";

jest.mock("../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

jest.mock("../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock("react-cookie-consent", () => {
  const Original = jest.requireActual("react-cookie-consent").default;
  return jest.fn(({ children, ...props }) => (
    <Original {...props}>{children}</Original>
  ));
});

describe("Consent", () => {
  beforeEach(() => jest.clearAllMocks());

  const arrange = () => render(<Consent />);

  describe("when a consent cookie is present", () => {
    beforeEach(() => {
      Cookies.set(settings.consentCookieName, "true");
      arrange();
    });

    it("should hide the banner", () => {
      expect(screen.queryByTestId(testIDs.consentMessageLine1)).toBeNull();
    });

    it("should initialize analytics", () => {
      expect(mockAnalyticsHook.setup).toBeCalledTimes(1);
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
      expect(messageBox1.innerHTML).toBe(translations.analytics.message1);
      expect(messageBox2.innerHTML).toBe(
        `<strong>${translations.analytics.message2}</strong>`
      );
    });

    it("should display the buttons", async () => {
      expect(
        await screen.findByText(translations.analytics.acceptMessage)
      ).toBeTruthy();
      expect(
        await screen.findByText(translations.analytics.declineMessage)
      ).toBeTruthy();
    });

    it("should style the banner correctly", () => {
      expect(CookieConsent).toBeCalledTimes(1);
      checkMockCall(
        CookieConsent as never as React.FC,
        {
          buttonStyle: {
            background: `converted(${mockColourHook.consentColour.accept.background})`,
            color: `converted(${mockColourHook.buttonColour.foreground})`,
          },
          buttonText: translations.analytics.acceptMessage,
          contentStyle: {
            flex: "1 0",
          },
          cookieName: settings.consentCookieName,
          declineButtonStyle: {
            background: `converted(${mockColourHook.consentColour.decline.background})`,
            color: `converted(${mockColourHook.buttonColour.foreground})`,
          },
          declineButtonText: translations.analytics.declineMessage,
          enableDeclineButton: true,
          setDeclineCookie: false,
          style: {
            background: `converted(${mockColourHook.componentColour.background})`,
            borderTopColor: `converted(${mockColourHook.buttonColour.border})`,
            borderTopStyle: "solid",
            borderTopWidth: "1px",
            color: `converted(${mockColourHook.componentColour.foreground})`,
            flexDirection: "column",
            zIndex: 999,
          },
          visible: "byCookieValue",
        },
        0,
        ["onAccept"]
      );
    });

    describe("when accept is pressed", () => {
      beforeEach(async () => {
        const button = await screen.findByText(
          translations.analytics.acceptMessage
        );
        fireEvent.click(button);
      });

      it("should set a cookie", () => {
        expect(Cookies.get(settings.consentCookieName)).toBe("true");
      });

      it("should initialize analytics", () => {
        expect(mockAnalyticsHook.setup).toBeCalledTimes(1);
      });
    });

    describe("when decline is pressed", () => {
      beforeEach(async () => {
        const button = await screen.findByText(
          translations.analytics.declineMessage
        );
        fireEvent.click(button);
      });

      it("should hide the banner", () => {
        expect(screen.queryByTestId(testIDs.consentMessageLine1)).toBeNull();
      });
    });
  });
});
