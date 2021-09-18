import { waitFor, screen, render } from "@testing-library/react";
import Header from "../../components/header/header.component";
import AnalyticsProvider from "../analytics/analytics.provider";
import NavBarProvider from "../navbar/navbar.provider";
import RootProvider from "../root.provider";
import UserInterfaceRootProvider from "../ui/ui.root.provider";
import UserProvider from "../user/user.provider";

jest.mock("../../components/header/header.component", () =>
  createProviderMock(providers.Header)
);

jest.mock("../../providers/analytics/analytics.provider", () =>
  createProviderMock(providers.AnalyticsProvider)
);

jest.mock("../../providers/navbar/navbar.provider", () =>
  createProviderMock(providers.NavBarProvider)
);

jest.mock("../../providers/user/user.provider", () =>
  createProviderMock(providers.UserProvider)
);

jest.mock("../ui/ui.root.provider", () =>
  createProviderMock(providers.UserInterfaceRootProvider)
);

const createProviderMock = (name: string) => {
  const {
    factoryInstance,
  } = require("../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

const providers = {
  AnalyticsProvider: "AnalyticsProvider",
  Header: "Header",
  NavBarProvider: "NavBarProvider",
  RootProvider: "RootProvider",
  UserProvider: "UserProvider",
  UserInterfaceRootProvider: "UserInterfaceRootProvider",
};

describe("RootProvider", () => {
  const testPageKey = "test";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async (pageKey?: string) => {
    const headerProps = pageKey ? { pageKey } : undefined;
    render(
      <RootProvider headerProps={headerProps}>
        <div data-testid={providers.RootProvider}>Test</div>
      </RootProvider>
    );
  };

  describe("When Rendered, without a pageKey", () => {
    beforeEach(() => arrange());

    it("should call the Header component correctly", async () => {
      await waitFor(() => expect(Header).toBeCalledTimes(1));
      await waitFor(() =>
        expect(Header).toBeCalledWith({ pageKey: "default" }, {})
      );
      expect(await screen.findByTestId(providers.Header)).toBeTruthy;
    });
  });

  describe("When Rendered, with a pageKey", () => {
    beforeEach(() => arrange(testPageKey));

    it("should call the Header component correctly", async () => {
      await waitFor(() => expect(Header).toBeCalledTimes(1));
      await waitFor(() =>
        expect(Header).toBeCalledWith({ pageKey: testPageKey }, {})
      );
      expect(await screen.findByTestId(providers.Header)).toBeTruthy;
    });

    it("should initialize the Analytics Provider", async () => {
      await waitFor(() => expect(AnalyticsProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.AnalyticsProvider)).toBeTruthy;
    });

    it("should initialize the NavBar Provider", async () => {
      await waitFor(() => expect(NavBarProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.NavBarProvider)).toBeTruthy;
    });

    it("should initialize the UserProvider", async () => {
      await waitFor(() => expect(UserProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.UserProvider)).toBeTruthy;
    });

    it("should initialize the UserInterfaceProvider", async () => {
      await waitFor(() => expect(UserInterfaceRootProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.UserInterfaceRootProvider))
        .toBeTruthy;
    });

    it("should display the RootProvider's Child Elements", async () => {
      expect(await screen.findByTestId(providers.RootProvider)).toBeTruthy;
    });
  });
});
