import { render } from "@testing-library/react";
import FooterComponent from "../inlays/terms.footer.component";
import HeaderComponent from "../inlays/terms.header.component";
import ToggleComponent from "../inlays/terms.toggle.component";
import TermsOfServiceContainer from "../terms.container";
import DialogueContainer from "@src/components/dialogues/resizable/dialogue.resizable.container";
import {
  checkTProp,
  MockUseTranslation,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock(
  "@src/components/dialogues/resizable/dialogue.resizable.container",
  () => require("@fixtures/react/child").createComponent("DialogueContainer")
);

describe("TermsOfServiceContainer", () => {
  const mockT = new MockUseTranslation("legal").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<TermsOfServiceContainer />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    checkTProp({
      name: "Dialogue",
      component: DialogueContainer,
      namespace: "legal",
    });

    it("should render the Dialogue component as expected", () => {
      expect(DialogueContainer).toBeCalledTimes(1);
      const call = jest.mocked(DialogueContainer).mock.calls[0][0];
      expect(call.t).toBeDefined();
      expect(call.titleText).toBe(mockT("termsOfService.title"));
      expect(call.BodyComponent).toBeUndefined();
      expect(call.HeaderComponent).toBe(HeaderComponent);
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
      expect(Object.keys(call).length).toBe(5);
    });
  });
});
