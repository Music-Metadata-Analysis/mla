import { render, screen } from "@testing-library/react";
import flagsmith from "flagsmith/isomorphic";
import { FlagsmithProvider, FlagsmithContextType } from "flagsmith/react";
import FlagProvider from "../flagsmith";
import checkMockCalls from "@src/fixtures/mocks/mock.component.call";

jest.mock("@src/utilities/generics/voids");

jest.mock("flagsmith/isomorphic");

jest.mock("flagsmith/react", () =>
  require("@fixtures/react/parent").createComponent(
    "FlagsmithProvider",
    "FlagsmithProvider"
  )
);

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
