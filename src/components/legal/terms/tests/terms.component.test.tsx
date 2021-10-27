import { render } from "@testing-library/react";
import Dialogue from "../../../dialogues/resizable/dialogue.resizable.component";
import FooterComponent from "../inlays/terms.footer.component";
import HeaderComponent from "../inlays/terms.header.component";
import ToggleComponent from "../inlays/terms.toggle.component";
import TermsOfService from "../terms.component";

jest.mock("../../../dialogues/resizable/dialogue.resizable.component", () =>
  jest.fn(() => <div>MockDialogue</div>)
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

    it("should call Dialogue as expected", () => {
      expect(Dialogue).toBeCalledTimes(1);
      const call = (Dialogue as jest.Mock).mock.calls[0][0];
      expect(typeof call.t).toBe("function");
      expect(call.titleKey).toBe("termsOfService.title");
      expect(typeof call.BodyComponent).toBe("function");
      expect(call.HeaderComponent).toBe(HeaderComponent);
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
    });
  });
});
