import { render } from "@testing-library/react";
import Page from "../report.page";
import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import mockLastFMHook from "@src/hooks/tests/lastfm.mock.hook";
import mockCheckCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/components/errors/boundary/error.boundary.component", () =>
  require("@fixtures/react").createComponent("ErrorBoundary")
);

jest.mock("@src/hooks/lastfm", () => () => mockLastFMHook);

const MockReportContainer = jest.fn(() => <div>MockReportContainer</div>);
const MockNoUserPage = jest.fn(() => <div>MockNoUserPage</div>);

const mockWindowResponse = jest.fn();

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

describe("ReportPage", () => {
  const testUser = "someuser";

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
        expect(ErrorBoundary).toBeCalledTimes(1);
        mockCheckCall(
          ErrorBoundary,
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
        mockCheckCall(
          MockReportContainer,
          {
            userName: testUser,
            user: mockLastFMHook,
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
        mockCheckCall(MockNoUserPage, {});
      });
    });
  });
});
