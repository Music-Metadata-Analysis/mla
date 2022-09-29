import { render } from "@testing-library/react";
import FeedbackPopup from "../feedback.popup";
import RootPopup from "../root.popup";

jest.mock("../feedback.popup", () =>
  require("@fixtures/react/child").createComponent("FeedbackPopup")
);

describe("RootPopup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<RootPopup />);
  };

  it("should call the FeedbackPopup component", () => {
    expect(FeedbackPopup).toBeCalledTimes(1);
  });
});
