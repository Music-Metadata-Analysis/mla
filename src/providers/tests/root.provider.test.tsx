import { waitFor, screen, render } from "@testing-library/react";
import Header from "../../components/header/header.component";
import AnalyticsProvider from "../analytics/analytics.provider";
import RootProvider from "../root.provider";
import UserInterfaceProvider from "../ui/ui.provider";
import UserProvider from "../user/user.provider";

const providers = {
  AnalyticsProvider: "AnalyticsProvider",
  Header: "Header",
  RootProvider: "RootProvider",
  UserProvider: "UserProvider",
  UserInterfaceProvider: "UserInterfaceProvider",
};

const createProviderMock = (name: string) => {
  const {
    mockComponentWithChildrenFactory,
  } = require("../../tests/fixtures/mock.factory.class");
  return mockComponentWithChildrenFactory.create(name);
};

jest.mock("../../components/header/header.component", () =>
  createProviderMock(providers.Header)
);
jest.mock("../../providers/analytics/analytics.provider", () =>
  createProviderMock(providers.AnalyticsProvider)
);
jest.mock("../../providers/user/user.provider", () =>
  createProviderMock(providers.UserProvider)
);
jest.mock("../ui/ui.provider", () =>
  createProviderMock(providers.UserInterfaceProvider)
);

describe("RootProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async () => {
    render(
      <RootProvider>
        <div data-testid={providers.RootProvider}>Test</div>
      </RootProvider>
    );
  };

  describe("When Rendered", () => {
    it("should call the Header component correctly", async () => {
      arrange();
      await waitFor(() => expect(Header).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.Header)).toBeTruthy;
    });

    it("should initialize the Analytics Provider", async () => {
      arrange();
      await waitFor(() => expect(AnalyticsProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.AnalyticsProvider)).toBeTruthy;
    });

    it("should initialize the UserProvider", async () => {
      arrange();
      await waitFor(() => expect(UserProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.UserProvider)).toBeTruthy;
    });

    it("should initialize the UserInterfaceProvider", async () => {
      arrange();
      await waitFor(() => expect(UserInterfaceProvider).toBeCalledTimes(1));
      expect(await screen.findByTestId(providers.UserInterfaceProvider))
        .toBeTruthy;
    });

    it("should display the RootProvider's Child Elements", async () => {
      arrange();
      expect(await screen.findByTestId(providers.RootProvider)).toBeTruthy;
    });
  });
});
