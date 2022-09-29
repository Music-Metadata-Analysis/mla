import { render } from "@testing-library/react";
import BodyComponent from "../inlays/splash.body.component";
import FooterComponent from "../inlays/splash.footer.component";
import ToggleComponent from "../inlays/splash.toggle.component";
import Splash from "../splash.component";
import Dialogue from "@src/components/dialogues/resizable/dialogue.resizable.component";
import { checkTProp } from "@src/hooks/__mocks__/locale.mock";

jest.mock("@src/hooks/locale");

jest.mock(
  "@src/components/dialogues/resizable/dialogue.resizable.component",
  () => require("@fixtures/react/child").createComponent("Dialogue")
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

    checkTProp({
      name: "Dialogue",
      component: Dialogue,
      namespace: "splash",
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
