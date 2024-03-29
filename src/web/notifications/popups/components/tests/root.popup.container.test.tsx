import { render } from "@testing-library/react";
import RootPopUpContainer from "../root.popup.container";
import { mockIsSSR } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import FeedbackPopUpContainer from "@src/web/notifications/popups/components/feedback/feedback.popup.container";

jest.mock("@src/vendors/integrations/web.framework/vendor");

jest.mock(
  "@src/web/notifications/popups/components/feedback/feedback.popup.container",
  () =>
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
      expect(FeedbackPopUpContainer).toHaveBeenCalledTimes(1);
      expect(FeedbackPopUpContainer).toHaveBeenCalledWith({}, {});
    });
  });

  describe("when isSSR returns true", () => {
    beforeEach(() => {
      mockIsSSR.mockReturnValueOnce(true);

      arrange();
    });

    it("should NOT call the FeedbackPopUpContainer component", () => {
      expect(FeedbackPopUpContainer).toHaveBeenCalledTimes(0);
    });
  });
});
