import { ColorModeScript } from "@chakra-ui/react";
import { render } from "@testing-library/react";
// eslint-disable-next-line @next/next/no-document-import-in-page
import { Html, Head, Main, NextScript } from "next/document";
import BaseDocument from "@src/pages/_document";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";
import type { Component } from "react";

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  ...require("@fixtures/react/child").createComponent(
    "ColorModeScript",
    "ColorModeScript"
  ),
}));

jest.mock("next/document", () => {
  const { Component } = jest.requireActual("react");
  const mockMain = require("@fixtures/react/child").createComponent(
    "Main",
    "Main"
  );
  const mockNextScript = require("@fixtures/react/child").createComponent(
    "NextScript",
    "NextScript"
  );
  return {
    __esModule: true,
    default: Component,
    Html: jest.fn(({ children }) => <>{children}</>),
    Head: jest.fn(() => (
      // eslint-disable-next-line @next/next/no-head-element
      <head>
        <title>Mock Head Component</title>
      </head>
    )),
    ...mockMain,
    ...mockNextScript,
  };
});

describe("BaseDocument", () => {
  const html = document.createElement("html");
  const RenderableBaseDocument = BaseDocument as typeof Component;

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<RenderableBaseDocument />, {
      container: html,
    });
  };

  it("should render the Html Component with the correct props", () => {
    expect(Html).toBeCalledTimes(1);
    checkMockCall(Html, {});
  });

  it("should render the Head with the correct props", () => {
    expect(Head).toBeCalledTimes(1);
    checkMockCall(Head, {});
  });

  it("should render the ColorModeScript with the correct props", () => {
    expect(ColorModeScript).toBeCalledTimes(1);
    checkMockCall(ColorModeScript, {
      initialColorMode: uiFrameworkVendor.core.config.initialColourMode,
    });
  });

  it("should render the Main component with the correct props", () => {
    expect(Main).toBeCalledTimes(1);
    checkMockCall(Main, {});
  });

  it("should render the NextScript component with the correct props", () => {
    expect(NextScript).toBeCalledTimes(1);
    checkMockCall(NextScript, {});
  });
});
