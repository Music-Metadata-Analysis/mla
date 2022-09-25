import { render } from "@testing-library/react";
import BodyComponent from "../inlays/splash.body.component";
import FooterComponent from "../inlays/splash.footer.component";
import ToggleComponent from "../inlays/splash.toggle.component";
import Splash from "../splash.component";
import Dialogue from "@src/components/dialogues/resizable/dialogue.resizable.component";
import { mockTProp, checkTProp } from "@src/hooks/tests/locale.mock.hook";

jest.mock(
  "@src/components/dialogues/resizable/dialogue.resizable.component",
  () => jest.fn(() => <div>MockDialogue</div>)
);

jest.mock("@src/hooks/locale.ts", () => (ns: string) => ({
  t: new mockTProp(ns),
}));

describe("Splash", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Splash />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    checkTProp({
      name: "Dialogue",
      component: Dialogue,
      namespace: "splash",
      arg: 0,
      call: 0,
      prop: "t",
    });

    it("should call Dialogue as expected to display the logo", () => {
      expect(Dialogue).toBeCalledTimes(1);
      const call = (Dialogue as jest.Mock).mock.calls[0][0];
      expect(call.titleKey).toBe("title");
      expect(call.BodyComponent).toBe(BodyComponent);
      expect(typeof call.HeaderComponent).toBe("function");
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
    });
  });
});
