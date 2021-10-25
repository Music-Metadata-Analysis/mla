import { render } from "@testing-library/react";
import Dialogue from "../../../dialogues/resizable/dialogue.resizable.component";
import FooterComponent from "../inlays/privacy.footer.component";
import HeaderComponent from "../inlays/privacy.header.component";
import ToggleComponent from "../inlays/privacy.toggle.component";
import Privacy from "../privacy.component";

jest.mock("../../../dialogues/resizable/dialogue.resizable.component", () =>
  jest.fn(() => <div>MockDialogue</div>)
);

describe("Privacy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Privacy />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Dialogue as expected to display the logo", () => {
      expect(Dialogue).toBeCalledTimes(1);
      const call = (Dialogue as jest.Mock).mock.calls[0][0];
      expect(typeof call.t).toBe("function");
      expect(call.titleKey).toBe("privacy.title");
      expect(typeof call.BodyComponent).toBe("function");
      expect(call.HeaderComponent).toBe(HeaderComponent);
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
    });
  });
});
