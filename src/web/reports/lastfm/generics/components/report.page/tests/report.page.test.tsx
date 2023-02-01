import { render } from "@testing-library/react";
import Page from "../report.page";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import routes from "@src/config/routes";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockLastFMHook from "@src/hooks/__mocks__/lastfm.hook.mock";
import Events from "@src/web/analytics/collection/events/definitions";

jest.mock("@src/hooks/lastfm.hook");

jest.mock("@src/components/errors/boundary/error.boundary.container", () =>
  require("@fixtures/react/parent").createComponent("ErrorBoundary")
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
    describe("with a proper query string", () => {
      beforeEach(() => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("username", testUser);
        window.location.search = searchParams.toString();
        arrange();
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
    });

    describe("without a proper query string", () => {
      beforeEach(() => {
        window.location.search = "";
        arrange();
      });

      it("should call the MockNoUserPage correctly", async () => {
        expect(MockNoUserPage).toBeCalledTimes(1);
        checkMockCall(MockNoUserPage, {});
      });
    });
  });
});
