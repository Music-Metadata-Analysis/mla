import { render } from "@testing-library/react";
import FooterComponent from "../inlays/privacy.footer.component";
import HeaderComponent from "../inlays/privacy.header.component";
import ToggleComponent from "../inlays/privacy.toggle.component";
import PrivacyContainer from "../privacy.container";
import DialogueContainer from "@src/components/dialogues/resizable/dialogue.resizable.container";
import {
  checkTProp,
  MockUseLocale,
} from "@src/hooks/__mocks__/locale.hook.mock";

jest.mock("@src/hooks/locale.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock(
  "@src/components/dialogues/resizable/dialogue.resizable.container",
  () => require("@fixtures/react/child").createComponent("DialogueContainer")
);

describe("PrivacyContainer", () => {
  const mockT = new MockUseLocale("legal").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<PrivacyContainer />);
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
      expect(call.titleText).toBe(mockT("privacy.title"));
      expect(call.BodyComponent).toBeUndefined();
      expect(call.HeaderComponent).toBe(HeaderComponent);
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
      expect(Object.keys(call).length).toBe(5);
    });
  });
});
