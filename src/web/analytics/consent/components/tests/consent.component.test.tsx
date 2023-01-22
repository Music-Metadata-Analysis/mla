import { Text } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import CookieConsent from "react-cookie-consent";
import Consent, { ConsentProps } from "../consent.component";
import { testIDs } from "../consent.identifiers";
import { settings } from "@src/config/cookies";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Text"])
);

jest.mock("react-cookie-consent", () => {
  const Original = jest.requireActual("react-cookie-consent").default;
  return jest.fn(({ children, ...props }) => (
    <Original {...props}>{children}</Original>
  ));
});

describe("Consent", () => {
  const currentProps: ConsentProps = {
    acceptButtonText: "mockAcceptButtonText",
    declineButtonText: "mockDeclineButtonText",
    consentMessageLine1Text: "mockConsentMessageLine1Text",
    consentMessageLine2Text: "mockConsentMessageLine2Text",
    onAccept: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    arrange();
  });

  const arrange = () => render(<Consent {...currentProps} />);

  it("should render the chakra Text component with the correct props", () => {
    expect(Text).toBeCalledTimes(2);
    checkMockCall(
      Text,
      {
        "data-testid": testIDs.consentMessageLine1,
        fontSize: ["xs", "sm", "m"],
      },
      0
    );
    checkMockCall(
      Text,
      {
        "data-testid": testIDs.consentMessageLine2,
        fontSize: ["sm", "m", "l"],
      },
      1
    );
  });

  it("should render the first consent message inside a Text component", async () => {
    expect(
      await within(
        await screen.findByTestId(testIDs.consentMessageLine1)
      ).findByText(currentProps.consentMessageLine1Text)
    ).toBeTruthy();
  });

  it("should render the second consent message inside a Text component", async () => {
    const messageBox2 = await screen.findByTestId(testIDs.consentMessageLine2);
    expect(messageBox2.innerHTML).toBe(
      `<strong>${currentProps.consentMessageLine2Text}</strong>`
    );
  });

  it("should render the CookieConsent component with the correct props", () => {
    expect(CookieConsent).toBeCalledTimes(1);
    checkMockCall(
      CookieConsent as never as React.FC,
      {
        buttonStyle: {
          background: `converted(${mockColourHook.consentColour.accept.background})`,
          color: `converted(${mockColourHook.buttonColour.foreground})`,
        },
        buttonText: currentProps.acceptButtonText,
        contentStyle: {
          flex: "1 0",
        },
        cookieName: settings.consentCookieName,
        declineButtonStyle: {
          background: `converted(${mockColourHook.consentColour.decline.background})`,
          color: `converted(${mockColourHook.buttonColour.foreground})`,
        },
        declineButtonText: currentProps.declineButtonText,
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
});
