import { render } from "@testing-library/react";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import routes from "@src/config/routes";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import Page, { getServerSideProps } from "@src/pages/legal/privacy";
import {
  mockServerSideProps,
  mockUtilities,
} from "@src/vendors/integrations/web.framework/__mocks__/vendor.ssr.mock";
import Events from "@src/web/analytics/collection/events/definitions";
import PrivacyContainer from "@src/web/content/privacy/components/privacy.container";

jest.mock("@src/vendors/integrations/web.framework/vendor.ssr");

jest.mock("@src/components/errors/boundary/error.boundary.container", () =>
  require("@fixtures/react/parent").createComponent("ErrorBoundary")
);

jest.mock("@src/web/content/privacy/components/privacy.container", () =>
  require("@fixtures/react/parent").createComponent("PrivacyContainer")
);

describe("getServerSideProps", () => {
  it("should be the return value of serverSideProps", () => {
    expect(getServerSideProps).toBe(mockServerSideProps);
  });

  it("should be generated by a correct call to serverSideProps", () => {
    expect(mockUtilities.serverSideProps).toBeCalledTimes(1);
    expect(mockUtilities.serverSideProps).toBeCalledWith({
      pageKey: "privacy",
      translations: ["legal"],
    });
  });
});

describe("Privacy", () => {
  const arrange = () => {
    render(<Page />);
  };

  beforeEach(() => jest.clearAllMocks());

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the ErrorBoundary component correctly", () => {
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

    it("should call the Privacy component", () => {
      expect(PrivacyContainer).toBeCalledTimes(1);
      checkMockCall(PrivacyContainer, {});
    });
  });
});
