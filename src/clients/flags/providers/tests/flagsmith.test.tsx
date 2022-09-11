import { render, screen } from "@testing-library/react";
import flagsmith from "flagsmith/isomorphic";
import { FlagsmithProvider, FlagsmithContextType } from "flagsmith/react";
import checkMockCalls from "../../../../tests/fixtures/mock.component.call";
import FlagProvider from "../flagsmith";

jest.mock("flagsmith/isomorphic", () => ({ mock: "object" }));

jest.mock("flagsmith/react", () =>
  createProviderMock("FlagsmithProvider", "FlagsmithProvider")
);

const createProviderMock = (name: string, exportName = "default") => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name, exportName);
};

describe("FlagProvider", () => {
  const mockFlagState = {
    mockFlag: { enabled: false },
  } as unknown as FlagsmithContextType["serverState"];
  const mockFlagEnvironment = "mockFlagEnvironment";
  let originalEnvironment: typeof process.env;

  const setupEnv = () => {
    process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT = mockFlagEnvironment;
  };

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    setupEnv();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const arrange = () => {
    render(
      <FlagProvider state={mockFlagState}>
        <div>{"MockChildComponent"}</div>
      </FlagProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should initialize the vendor's provider", async () => {
      expect(await screen.findByTestId("FlagsmithProvider")).toBeTruthy;
    });

    it("should initialize the vendor's provider with the correct arguments", () => {
      expect(FlagsmithProvider).toBeCalledTimes(1);
      checkMockCalls(
        FlagsmithProvider,
        {
          flagsmith,
          options: {
            environmentID: mockFlagEnvironment,
          },
          serverState: mockFlagState,
        },
        0,
        []
      );
    });
  });
});
