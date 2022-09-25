import { render, screen } from "@testing-library/react";
import flagsmith from "flagsmith/isomorphic";
import { FlagsmithProvider, FlagsmithContextType } from "flagsmith/react";
import FlagProvider from "../flagsmith";
import checkMockCalls from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/utils/voids", () => {
  const module = require("@src/utils/tests/voids.mock");
  return { normalizeUndefined: module.mockNormalizeUndefined };
});

jest.mock("flagsmith/isomorphic", () => ({ mock: "object" }));

jest.mock("flagsmith/react", () =>
  createProviderMock("FlagsmithProvider", "FlagsmithProvider")
);

const createProviderMock = (name: string, exportName = "default") => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name, exportName);
};

describe("FlagProvider", () => {
  const mockIdentity = "mockIdentity";
  const mockFlagState = {
    serverState: {
      mockFlag: { enabled: false },
    } as unknown as FlagsmithContextType["serverState"],
    identity: mockIdentity,
  };
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
            identity: `normalizeUndefined(${mockFlagState.identity})`,
          },
          serverState: mockFlagState.serverState,
        },
        0,
        []
      );
    });
  });
});
