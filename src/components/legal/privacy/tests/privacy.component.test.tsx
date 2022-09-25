import { render } from "@testing-library/react";
import FooterComponent from "../inlays/privacy.footer.component";
import HeaderComponent from "../inlays/privacy.header.component";
import ToggleComponent from "../inlays/privacy.toggle.component";
import Privacy from "../privacy.component";
import Dialogue from "@src/components/dialogues/resizable/dialogue.resizable.component";
import { mockTProp, checkTProp } from "@src/hooks/tests/locale.mock.hook";

jest.mock("@src/hooks/locale.ts", () => (ns: string) => ({
  t: new mockTProp(ns),
}));

jest.mock(
  "@src/components/dialogues/resizable/dialogue.resizable.component",
  () => jest.fn(() => <div>MockDialogue</div>)
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

    checkTProp({
      name: "Dialogue",
      component: Dialogue,
      namespace: "legal",
      arg: 0,
      call: 0,
      prop: "t",
    });

    it("should call Dialogue as expected", () => {
      expect(Dialogue).toBeCalledTimes(1);
      const call = (Dialogue as jest.Mock).mock.calls[0][0];
      expect(call.titleKey).toBe("privacy.title");
      expect(typeof call.BodyComponent).toBe("function");
      expect(call.HeaderComponent).toBe(HeaderComponent);
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
    });
  });
});
