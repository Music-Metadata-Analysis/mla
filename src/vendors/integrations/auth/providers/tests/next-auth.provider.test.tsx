import { render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import NextAuthProvider from "../next-auth";
import checkMockCalls from "@src/tests/fixtures/mock.component.call";
import type { Session } from "next-auth";

jest.mock("next-auth/react", () =>
  require("@fixtures/react/parent").createComponent(
    "SessionProvider",
    "SessionProvider"
  )
);

describe("NextAuthProvider", () => {
  const mockSession = {
    mockSession: "mockSession",
  } as unknown as Session;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <NextAuthProvider session={mockSession}>
        <div>{"MockChildComponent"}</div>
      </NextAuthProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should initialize the vendor's provider", async () => {
      expect(await screen.findByTestId("SessionProvider")).toBeTruthy;
    });

    it("should initialize the vendor's provider with the correct arguments", () => {
      expect(SessionProvider).toBeCalledTimes(1);
      checkMockCalls(
        SessionProvider,
        {
          session: mockSession,
        },
        0,
        []
      );
    });
  });
});
