import { ColorModeScript } from "@chakra-ui/react";
import { render } from "@testing-library/react";
// eslint-disable-next-line @next/next/no-document-import-in-page
import { Html, Head, Main, NextScript } from "next/document";
import checkMockCall from "../../src/tests/fixtures/mock.component.call";
import BaseDocument from "../pages/_document";
import type { Component } from "react";

jest.mock("@chakra-ui/react", () => ({
  ColorModeScript: jest.fn(() => <div>MockColourModeScript</div>),
}));

jest.mock("next/document", () => {
  const { Component } = jest.requireActual("react");
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
    Main: jest.fn(() => <div>MockMainComponent</div>),
    NextScript: jest.fn(() => <div>MockMainComponent</div>),
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
    checkMockCall(ColorModeScript, {});
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
