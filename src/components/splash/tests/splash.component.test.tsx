import { render } from "@testing-library/react";
import Dialogue from "../../dialogues/resizable/dialogue.resizable.component";
import BodyComponent from "../inlays/splash.body.component";
import FooterComponent from "../inlays/splash.footer.component";
import ToggleComponent from "../inlays/splash.toggle.component";
import Splash from "../splash.component";

jest.mock("../../dialogues/resizable/dialogue.resizable.component", () =>
  jest.fn(() => <div>MockDialogue</div>)
);

describe("Splash", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Splash />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Dialogue as expected to display the logo", () => {
      expect(Dialogue).toBeCalledTimes(1);
      const call = (Dialogue as jest.Mock).mock.calls[0][0];
      expect(typeof call.t).toBe("function");
      expect(call.titleKey).toBe("title");
      expect(call.BodyComponent).toBe(BodyComponent);
      expect(typeof call.HeaderComponent).toBe("function");
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
    });
  });
});
