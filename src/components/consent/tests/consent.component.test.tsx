import { render, screen, fireEvent } from "@testing-library/react";
import Cookies from "js-cookie";
import CookieConsent from "react-cookie-consent";
import Consent, { testIDs } from "../consent.component";
import translations from "@locales/main.json";
import { settings } from "@src/config/cookies";
import mockAnalyticsHook from "@src/hooks/tests/analytics.mock.hook";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/analytics", () => () => mockAnalyticsHook);

jest.mock("@src/hooks/colour", () => () => mockColourHook);

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

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

    it("should style the banner correctly", () => {
      expect(CookieConsent).toBeCalledTimes(1);
      checkMockCall(
        CookieConsent as never as React.FC,
        {
          buttonStyle: {
            background: `converted(${mockColourHook.consentColour.accept.background})`,
            color: `converted(${mockColourHook.buttonColour.foreground})`,
          },
          buttonText: _t(translations.analytics.acceptMessage),
          contentStyle: {
            flex: "1 0",
          },
          cookieName: settings.consentCookieName,
          declineButtonStyle: {
            background: `converted(${mockColourHook.consentColour.decline.background})`,
            color: `converted(${mockColourHook.buttonColour.foreground})`,
          },
          declineButtonText: _t(translations.analytics.declineMessage),
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
          _t(translations.analytics.acceptMessage)
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
