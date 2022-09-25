import { render } from "@testing-library/react";
import About from "../about.component";
import BodyComponent from "../inlays/about.body.component";
import FooterComponent from "../inlays/about.footer.component";
import ToggleComponent from "../inlays/about.toggle.component";
import Dialogue from "@src/components/dialogues/resizable/dialogue.resizable.component";
import { mockTProp, checkTProp } from "@src/hooks/tests/locale.mock.hook";

jest.mock(
  "@src/components/dialogues/resizable/dialogue.resizable.component",
  () => jest.fn(() => <div>MockDialogue</div>)
);

jest.mock("@src/hooks/locale.ts", () => (ns: string) => ({
  t: new mockTProp(ns),
}));

describe("About", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<About />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    checkTProp({
      name: "Dialogue",
      component: Dialogue,
      namespace: "about",
      arg: 0,
      call: 0,
      prop: "t",
    });

    it("should call Dialogue as expected to display the logo", () => {
      expect(Dialogue).toBeCalledTimes(1);
      const call = (Dialogue as jest.Mock).mock.calls[0][0];
      expect(call.titleKey).toBe("title");
      expect(typeof call.HeaderComponent).toBe("function");
      expect(call.BodyComponent).toBe(BodyComponent);
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
    });
  });
});
