import { render } from "@testing-library/react";
import About from "../about.component";
import BodyComponent from "../inlays/about.body.component";
import FooterComponent from "../inlays/about.footer.component";
import ToggleComponent from "../inlays/about.toggle.component";
import Dialogue from "@src/components/dialogues/resizable/dialogue.resizable.component";
import { checkTProp } from "@src/hooks/__mocks__/locale.mock";

jest.mock("@src/hooks/router");

jest.mock("@src/hooks/locale");

jest.mock(
  "@src/components/dialogues/resizable/dialogue.resizable.component",
  () => require("@fixtures/react/child").createComponent("Dialogue")
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

    checkTProp({
      name: "Dialogue",
      component: Dialogue,
      namespace: "about",
    });

    it("should render the Dialogue component as expected", () => {
      expect(Dialogue).toBeCalledTimes(1);
      const call = jest.mocked(Dialogue).mock.calls[0][0];
      expect(call.t).toBeDefined();
      expect(call.titleKey).toBe("title");
      expect(call.BodyComponent).toBe(BodyComponent);
      expect(typeof call.HeaderComponent).toBe("function");
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
      expect(Object.keys(call).length).toBe(6);
    });
  });
});
