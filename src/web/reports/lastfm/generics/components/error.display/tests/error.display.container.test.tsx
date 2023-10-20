import { render } from "@testing-library/react";
import ErrorBase from "../error.conditions/bases/error.base.class.component";
import LastFMErrorDisplayContainer from "../error.display.container";
import { createSimpleComponent } from "@fixtures/react/simple";
import MockStage2Report from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.stage.2.json";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import { MockQueryClass } from "@src/web/reports/lastfm/generics/state/queries/tests/implementations/concrete.sunburst.query.class";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock(
  "@src/web/authentication/sign.in/components/authentication.container",
  () =>
    require("@fixtures/react/child").createComponent("AuthenticationComponent")
);

jest.mock("../error.conditions/bases/error.base.class.component");

describe("LastFMErrorDisplayContainer", () => {
  let mockReportProperties: LastFMReportStateBase;

  const mockQuery = new MockQueryClass();
  const MockChild = createSimpleComponent("MockChild");
  const MockError = createSimpleComponent("MockError");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    mockReportProperties = JSON.parse(JSON.stringify(MockStage2Report));

    render(
      <LastFMErrorDisplayContainer
        reportProperties={mockReportProperties}
        query={mockQuery}
      >
        <MockChild />
      </LastFMErrorDisplayContainer>
    );
  };

  const mockCondition = (
    mockComponent: unknown,
    returnValue: JSX.Element | null
  ) => {
    (mockComponent as jest.Mock).mockReturnValue({
      render: jest.fn(() => returnValue),
    });
  };

  const checkMockedErrorCondition = (
    mockedComponent: typeof ErrorBase,
    calls: number
  ) => {
    it("should call the error conditions correctly", () => {
      expect(mockedComponent).toBeCalledTimes(calls);

      (mockedComponent as jest.Mock).mock.calls.forEach((call) => {
        expect(call[0]).toStrictEqual({
          query: mockQuery,
          router: mockRouterHook,
          reportProperties: mockReportProperties,
        });
      });
    });
  };

  describe("when an error condition is triggered", () => {
    beforeEach(() => {
      mockCondition(ErrorBase, <MockError />);

      arrange();
    });

    checkMockedErrorCondition(ErrorBase, 1);

    it("should render the MockError component", () => {
      expect(MockError).toBeCalledTimes(1);
    });

    it("should NOT render the MockChild component", () => {
      expect(MockChild).toBeCalledTimes(0);
    });
  });

  describe("when no error condition is triggered", () => {
    beforeEach(() => {
      mockCondition(ErrorBase, null);

      arrange();
    });

    checkMockedErrorCondition(ErrorBase, 5);

    it("should NOT render the MockError component", () => {
      expect(MockError).toBeCalledTimes(0);
    });

    it("should render the MockChild component", () => {
      expect(MockChild).toBeCalledTimes(1);
    });
  });
});
