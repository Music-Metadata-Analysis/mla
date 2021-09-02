import { cleanup, render } from "@testing-library/react";
import routes from "../../../../../config/routes";
import mockLastFMHook from "../../../../../hooks/tests/lastfm.mock";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import mockRouter from "../../../../../tests/fixtures/mock.router";
import BillBoardSpinner from "../../../../billboard/billboard.spinner/billboard.spinner.component";
import ErrorDisplay from "../../../../errors/display/error.display.component";
import Top20 from "../top20.component";
import type useLastFM from "../../../../../hooks/lastfm";

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

jest.mock(
  "../../../../billboard/billboard.spinner/billboard.spinner.component",
  () => createMockedComponent("BillBoardSpinner")
);
jest.mock("../../../../errors/display/error.display.component", () =>
  createMockedComponent("ErrorDisplay")
);
jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => mockRouter,
}));

describe("Top20", () => {
  const testUsername = "niall-byrne";
  let mockHookState: ReturnType<typeof useLastFM>;

  beforeEach(() => {
    jest.clearAllMocks();
    resetHookState();
  });

  const checkDataFetching = () => {
    it("should clear the state and request new data", () => {
      expect(mockHookState.clear).toBeCalledTimes(1);
      expect(mockHookState.top20).toBeCalledTimes(1);
      expect(mockHookState.top20).toBeCalledWith(testUsername);
    });

    it("should clear the state during cleanup", () => {
      cleanup();
      expect(mockHookState.clear).toBeCalledTimes(2);
    });
  };

  const checkErrorDisplay = (errorKey: string) => {
    it("should render the ErrorDisplay as expected", () => {
      expect(ErrorDisplay).toBeCalledTimes(1);
      const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
      expect(call.errorKey).toBe(errorKey);
      expect(typeof call.resetError).toBe("function");
      expect(Object.keys(call).length).toBe(2);
    });
  };

  const resetHookState = () => {
    mockHookState = {
      ...mockLastFMHook,
      userProperties: { ...mockLastFMHook.userProperties },
    };
  };

  const arrange = () => {
    render(<Top20 username={testUsername} user={mockHookState} />);
  };

  describe("when there has been an error", () => {
    describe("when the request has failed", () => {
      beforeEach(() => {
        mockHookState.userProperties.error = true;
        arrange();
      });

      checkDataFetching();
      checkErrorDisplay("lastfm_communications");

      it("should NOT call the BillBoardSpinner", () => {
        expect(BillBoardSpinner).toBeCalledTimes(0);
      });

      describe("when resetError is called on ErrorDisplay", () => {
        beforeEach(() => {
          const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
          call.resetError();
        });

        it("should redirect to the search page", () => {
          expect(mockRouter.push).toBeCalledTimes(1);
          expect(mockRouter.push).toBeCalledWith(routes.search);
        });
      });
    });

    describe("when the request has been ratelimited", () => {
      beforeEach(() => {
        mockHookState.userProperties.ratelimited = true;
        arrange();
      });

      checkDataFetching();
      checkErrorDisplay("lastfm_ratelimited");

      it("should NOT call the BillBoardSpinner", () => {
        expect(BillBoardSpinner).toBeCalledTimes(0);
      });

      describe("when resetError is called on ErrorDisplay", () => {
        beforeEach(() => {
          const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
          call.resetError();
        });

        it("should reload the page", () => {
          expect(mockRouter.reload).toBeCalledTimes(1);
        });
      });
    });
  });

  describe("when there has NOT been an error", () => {
    describe("when the data is NOT in ready state", () => {
      beforeEach(() => {
        mockLastFMHook.userProperties.ready = false;
        arrange();
      });

      checkDataFetching();

      it("should call the BillBoardSpinner with 'true'", () => {
        expect(BillBoardSpinner).toBeCalledTimes(1);
        checkMockCall(BillBoardSpinner, { whileTrue: true });
      });
    });

    describe("when the data is in a ready state", () => {
      beforeEach(() => {
        mockLastFMHook.userProperties.ready = true;
        arrange();
      });

      checkDataFetching();

      it("should call the BillBoardSpinner with 'false'", () => {
        expect(BillBoardSpinner).toBeCalledTimes(1);
        checkMockCall(BillBoardSpinner, { whileTrue: false });
      });
    });
  });
});
