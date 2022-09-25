import { render } from "@testing-library/react";
import FooterComponent from "../inlays/terms.footer.component";
import HeaderComponent from "../inlays/terms.header.component";
import ToggleComponent from "../inlays/terms.toggle.component";
import TermsOfService from "../terms.component";
import Dialogue from "@src/components/dialogues/resizable/dialogue.resizable.component";
import { mockTProp, checkTProp } from "@src/hooks/tests/locale.mock.hook";

jest.mock("@src/hooks/locale.ts", () => (ns: string) => ({
  t: new mockTProp(ns),
}));

jest.mock(
  "@src/components/dialogues/resizable/dialogue.resizable.component",
  () => jest.fn(() => <div>MockDialogue</div>)
);

describe("TermsOfService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<TermsOfService />);
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
      expect(call.titleKey).toBe("termsOfService.title");
      expect(typeof call.BodyComponent).toBe("function");
      expect(call.HeaderComponent).toBe(HeaderComponent);
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
    });
  });
});
