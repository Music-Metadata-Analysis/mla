import { render } from "@testing-library/react";
import FooterComponent from "../inlays/terms.footer.component";
import HeaderComponent from "../inlays/terms.header.component";
import ToggleComponent from "../inlays/terms.toggle.component";
import TermsOfService from "../terms.component";
import Dialogue from "@src/components/dialogues/resizable/dialogue.resizable.component";
import { checkTProp } from "@src/hooks/__mocks__/locale.mock";

jest.mock("@src/hooks/locale");

jest.mock(
  "@src/components/dialogues/resizable/dialogue.resizable.component",
  () => require("@fixtures/react/child").createComponent("Dialogue")
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
    });

    it("should render the Dialogue component as expected", () => {
      expect(Dialogue).toBeCalledTimes(1);
      const call = jest.mocked(Dialogue).mock.calls[0][0];
      expect(call.t).toBeDefined();
      expect(call.titleKey).toBe("termsOfService.title");
      expect(typeof call.BodyComponent).toBe("function");
      expect(call.HeaderComponent).toBe(HeaderComponent);
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
      expect(Object.keys(call).length).toBe(6);
    });
  });
});
