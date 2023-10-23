import { render } from "@testing-library/react";
import Page from "../report.page";
import routes from "@src/config/routes";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import Events from "@src/web/analytics/collection/events/definitions";
import mockAuthHook from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";
import Authentication from "@src/web/authentication/sign.in/components/authentication.container";
import mockLastFMHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import ErrorBoundaryContainer from "@src/web/ui/errors/components/boundary/error.boundary.container";

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/web/reports/lastfm/generics/state/hooks/lastfm.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock(
  "@src/web/authentication/sign.in/components/authentication.container",
  () => require("@fixtures/react/child").createComponent("Authentication")
);

jest.mock(
  "@src/web/ui/errors/components/boundary/error.boundary.container",
  () => require("@fixtures/react/parent").createComponent("ErrorBoundary")
);

describe("ReportPage", () => {
  const testUser = "someuser";
  const MockReportContainer = jest.fn(() => <div>MockReportContainer</div>);
  const MockNoUserPage = jest.fn(() => <div>MockNoUserPage</div>);
  const mockWindowResponse = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      value: {
        hash: {
          endsWith: mockWindowResponse,
          includes: mockWindowResponse,
        },
        assign: mockWindowResponse,
      },
      writable: true,
    });
  });

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <Page
        NoUserComponent={MockNoUserPage}
        ReportContainer={MockReportContainer}
      />
    );
  };

  describe("when rendered", () => {
    describe("when authenticated", () => {
      beforeEach(() => (mockAuthHook.status = "authenticated"));

      describe("with a proper query string", () => {
        beforeEach(() => {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("username", testUser);
          window.location.search = searchParams.toString();
          arrange();
        });

        it("should NOT call the Authentication component", () => {
          expect(Authentication).toBeCalledTimes(0);
        });

        it("should call the ErrorBoundary correctly", () => {
          expect(ErrorBoundaryContainer).toBeCalledTimes(1);
          checkMockCall(
            ErrorBoundaryContainer,
            {
              route: routes.home,
              eventDefinition: Events.General.Error,
            },
            0,
            ["stateReset"]
          );
        });

        it("should call the MockReportContainer correctly", () => {
          expect(MockReportContainer).toBeCalledTimes(1);
          checkMockCall(
            MockReportContainer,
            {
              userName: testUser,
              lastfm: mockLastFMHook,
            },
            0,
            ["stateReset"]
          );
        });

        it("should NOT call the MockNoUserPage correctly", async () => {
          expect(MockNoUserPage).toBeCalledTimes(0);
        });
      });

      describe("without a proper query string", () => {
        beforeEach(() => {
          window.location.search = "";
          arrange();
        });

        it("should NOT call the Authentication component", () => {
          expect(Authentication).toBeCalledTimes(0);
        });

        it("should NOT call the ErrorBoundary", () => {
          expect(ErrorBoundaryContainer).toBeCalledTimes(0);
        });

        it("should NOT call the MockReportContainer correctly", () => {
          expect(MockReportContainer).toBeCalledTimes(0);
        });

        it("should call the MockNoUserPage correctly", async () => {
          expect(MockNoUserPage).toBeCalledTimes(1);
          checkMockCall(MockNoUserPage, {});
        });
      });
    });

    describe("when not authenticated", () => {
      beforeEach(() => (mockAuthHook.status = "unauthenticated"));

      describe("with a proper query string", () => {
        beforeEach(() => {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("username", testUser);
          window.location.search = searchParams.toString();
          arrange();
        });

        it("should call the Authentication component", () => {
          expect(Authentication).toBeCalledTimes(2);
          checkMockCall(Authentication, {});
        });

        it("should NOT call the ErrorBoundary", () => {
          expect(ErrorBoundaryContainer).toBeCalledTimes(0);
        });

        it("should NOT call the MockReportContainer correctly", () => {
          expect(MockReportContainer).toBeCalledTimes(0);
        });

        it("should NOT call the MockNoUserPage correctly", async () => {
          expect(MockNoUserPage).toBeCalledTimes(0);
        });
      });

      describe("without a proper query string", () => {
        beforeEach(() => {
          window.location.search = "";
          arrange();
        });

        it("should call the Authentication component", () => {
          expect(Authentication).toBeCalledTimes(2);
          checkMockCall(Authentication, {});
        });

        it("should NOT call the ErrorBoundary", () => {
          expect(ErrorBoundaryContainer).toBeCalledTimes(0);
        });

        it("should NOT call the MockReportContainer correctly", () => {
          expect(MockReportContainer).toBeCalledTimes(0);
        });

        it("should NOT call the MockNoUserPage correctly", async () => {
          expect(MockNoUserPage).toBeCalledTimes(0);
        });
      });
    });
  });
});
