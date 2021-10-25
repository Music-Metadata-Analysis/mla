import { render } from "@testing-library/react";
import Dialogue from "../../dialogues/resizable/dialogue.resizable.component";
import About from "../about.component";
import BodyComponent from "../inlays/about.body.component";
import FooterComponent from "../inlays/about.footer.component";
import ToggleComponent from "../inlays/about.toggle.component";

jest.mock("../../dialogues/resizable/dialogue.resizable.component", () =>
  jest.fn(() => <div>MockDialogue</div>)
);

describe("About", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<About />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Dialogue as expected to display the logo", () => {
      expect(Dialogue).toBeCalledTimes(1);
      const call = (Dialogue as jest.Mock).mock.calls[0][0];
      expect(typeof call.t).toBe("function");
      expect(call.titleKey).toBe("title");
      expect(typeof call.HeaderComponent).toBe("function");
      expect(call.BodyComponent).toBe(BodyComponent);
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
    });
  });
});
