import { render, waitFor } from "@testing-library/react";
import Dialogue from "../dialogue.resizable.component";
import DialogueContainer, {
  DialogueContainerProps,
} from "../dialogue.resizable.container";
import { createSimpleComponent } from "@fixtures/react/simple";
import dialogueSettings from "@src/config/dialogue";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import mockUseWindowThreshold from "@src/hooks/ui/__mocks__/window.threshold.hook.mock";
import useWindowThreshold from "@src/hooks/ui/window.threshold.hook";
import { mockUseRouter } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("@src/hooks/ui/window.threshold.hook");

jest.mock("../dialogue.resizable.component", () =>
  require("@fixtures/react/child").createComponent("Dialogue")
);

describe("DialogueContainer", () => {
  let currentProps: DialogueContainerProps;

  const originalWindowInnerHeight = window.innerHeight;

  const mockT = new MockUseLocale("splash").t;
  const mockBody = createSimpleComponent("Body");
  const mockFooter = createSimpleComponent("Footer");
  const mockHeader = createSimpleComponent("Header");
  const mockToggle = createSimpleComponent("Toggle");

  const baseProps = {
    BodyComponent: mockBody,
    FooterComponent: mockFooter,
    HeaderComponent: mockHeader,
    t: mockT,
    titleText: "mockTitleText",
    ToggleComponent: mockToggle,
  };

  beforeAll(() => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
    });
  });

  afterAll(() => {
    window.innerHeight = originalWindowInnerHeight;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    return render(<DialogueContainer {...currentProps} />);
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const checkDialogueProps = ({
    expectedToggleState,
  }: {
    expectedToggleState: boolean;
  }) => {
    it("should call the Dialogue component with the expected props", async () => {
      await waitFor(() => expect(Dialogue).toBeCalledTimes(1));
      checkMockCall(
        Dialogue,
        {
          BodyComponent: currentProps.BodyComponent,
          FooterComponent: currentProps.FooterComponent,
          HeaderComponent: currentProps.HeaderComponent,
          t: currentProps.t,
          titleText: currentProps.titleText,
          toggleState: expectedToggleState,
          ToggleComponent: currentProps.ToggleComponent,
          router: mockUseRouter,
        },
        0
      );
    });
  };

  const checkWindowThreshold = () => {
    it("should initialize the window threshold with the correct settings", () => {
      expect(useWindowThreshold).toBeCalledTimes(1);
      expect(useWindowThreshold).toBeCalledWith({
        axis: "innerHeight",
        threshold: dialogueSettings.toggleMinimumDisplayHeight,
        lowState: false,
      });
    });
  };

  describe("when the window threshold state is true", () => {
    beforeEach(() => {
      mockUseWindowThreshold.state = true;
    });

    describe("with all component props", () => {
      beforeEach(() => {
        arrange();
      });

      checkWindowThreshold();
      checkDialogueProps({ expectedToggleState: true });
    });

    describe("without a BodyComponent", () => {
      beforeEach(() => {
        currentProps.BodyComponent = undefined;

        arrange();
      });

      checkWindowThreshold();
      checkDialogueProps({ expectedToggleState: true });
    });

    describe("without a FooterComponent", () => {
      beforeEach(() => {
        currentProps.FooterComponent = undefined;

        arrange();
      });

      checkWindowThreshold();
      checkDialogueProps({ expectedToggleState: true });
    });

    describe("without a HeaderComponent", () => {
      beforeEach(() => {
        currentProps.HeaderComponent = undefined;

        arrange();
      });

      checkWindowThreshold();
      checkDialogueProps({ expectedToggleState: true });
    });

    describe("without a ToggleComponent", () => {
      beforeEach(() => {
        currentProps.ToggleComponent = undefined;

        arrange();
      });

      checkWindowThreshold();
      checkDialogueProps({ expectedToggleState: true });
    });
  });

  describe("when the window threshold state is false", () => {
    beforeEach(() => {
      mockUseWindowThreshold.state = false;
    });

    describe("with all component props", () => {
      beforeEach(() => {
        arrange();
      });

      checkWindowThreshold();
      checkDialogueProps({ expectedToggleState: false });
    });

    describe("without a BodyComponent", () => {
      beforeEach(() => {
        currentProps.BodyComponent = undefined;

        arrange();
      });

      checkDialogueProps({ expectedToggleState: false });
    });

    describe("without a FooterComponent", () => {
      beforeEach(() => {
        currentProps.FooterComponent = undefined;

        arrange();
      });

      checkWindowThreshold();
      checkDialogueProps({ expectedToggleState: false });
    });

    describe("without a HeaderComponent", () => {
      beforeEach(() => {
        currentProps.HeaderComponent = undefined;

        arrange();
      });

      checkWindowThreshold();
      checkDialogueProps({ expectedToggleState: false });
    });

    describe("without a ToggleComponent", () => {
      beforeEach(() => {
        currentProps.ToggleComponent = undefined;

        arrange();
      });

      checkWindowThreshold();
      checkDialogueProps({ expectedToggleState: false });
    });
  });
});
