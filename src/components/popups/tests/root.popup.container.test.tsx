import { render } from "@testing-library/react";
import FeedbackPopUpContainer from "../feedback.popup.container";
import RootPopUpContainer from "../root.popup.container";
import { mockIsSSR } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";

jest.mock("@src/vendors/integrations/web.framework/vendor");

jest.mock("../feedback.popup.container", () =>
  require("@fixtures/react/child").createComponent("FeedbackPopUpContainer")
);

describe("RootPopupContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<RootPopUpContainer />);
  };

  describe("when isSSR returns false", () => {
    beforeEach(() => {
      mockIsSSR.mockReturnValueOnce(false);

      arrange();
    });

    it("should call the FeedbackPopUpContainer component", () => {
      expect(FeedbackPopUpContainer).toBeCalledTimes(1);
      expect(FeedbackPopUpContainer).toBeCalledWith({}, {});
    });
  });

  describe("when isSSR returns true", () => {
    beforeEach(() => {
      mockIsSSR.mockReturnValueOnce(true);

      arrange();
    });

    it("should NOT call the FeedbackPopUpContainer component", () => {
      expect(FeedbackPopUpContainer).toBeCalledTimes(0);
    });
  });
});
