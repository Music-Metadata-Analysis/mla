import { render, fireEvent, waitFor } from "@testing-library/react";
import Dialogue from "../dialogue.resizable.component";
import DialogueContainer, {
  DialogueContainerProps,
} from "../dialogue.resizable.container";
import { createSimpleComponent } from "@fixtures/react/simple";
import { mockUseRouter } from "@src/clients/web.framework/__mocks__/vendor.mock";
import dialogueSettings from "@src/config/dialogue";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/router");

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
    expectedCalls,
    expectedToggleState,
  }: {
    expectedCalls: number;
    expectedToggleState: boolean;
  }) => {
    it("should call the Dialogue component with the expected props", async () => {
      await waitFor(() => expect(Dialogue).toBeCalledTimes(expectedCalls));
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
        expectedCalls - 1
      );
    });
  };

  const triggerScreenSizeChange = ({
    expectedCalls,
    expectedToggleState,
    newHeight,
  }: {
    expectedCalls: number;
    expectedToggleState: boolean;
    newHeight: number;
  }) => {
    describe("when the screen size is changed", () => {
      beforeEach(() => {
        window.innerHeight = newHeight;

        fireEvent.resize(window);
      });

      checkDialogueProps({ expectedCalls, expectedToggleState });
    });
  };

  describe("when the screen is >= threshold vertical size", () => {
    beforeEach(() => {
      window.innerHeight = dialogueSettings.toggleMinimumDisplayHeight;
    });

    describe("with all component props", () => {
      beforeEach(() => {
        arrange();
      });

      checkDialogueProps({ expectedCalls: 1, expectedToggleState: true });
      triggerScreenSizeChange({
        expectedCalls: 2,
        expectedToggleState: false,
        newHeight: dialogueSettings.toggleMinimumDisplayHeight - 1,
      });
    });

    describe("without a BodyComponent", () => {
      beforeEach(() => {
        currentProps.BodyComponent = undefined;

        arrange();
      });

      checkDialogueProps({ expectedCalls: 1, expectedToggleState: true });
      triggerScreenSizeChange({
        expectedCalls: 2,
        expectedToggleState: false,
        newHeight: dialogueSettings.toggleMinimumDisplayHeight - 1,
      });
    });

    describe("without a FooterComponent", () => {
      beforeEach(() => {
        currentProps.FooterComponent = undefined;

        arrange();
      });

      checkDialogueProps({ expectedCalls: 1, expectedToggleState: true });
      triggerScreenSizeChange({
        expectedCalls: 2,
        expectedToggleState: false,
        newHeight: dialogueSettings.toggleMinimumDisplayHeight - 1,
      });
    });

    describe("without a HeaderComponent", () => {
      beforeEach(() => {
        currentProps.HeaderComponent = undefined;

        arrange();
      });

      checkDialogueProps({ expectedCalls: 1, expectedToggleState: true });
      triggerScreenSizeChange({
        expectedCalls: 2,
        expectedToggleState: false,
        newHeight: dialogueSettings.toggleMinimumDisplayHeight - 1,
      });
    });

    describe("without a ToggleComponent", () => {
      beforeEach(() => {
        currentProps.ToggleComponent = undefined;

        arrange();
      });

      checkDialogueProps({ expectedCalls: 1, expectedToggleState: true });
      triggerScreenSizeChange({
        expectedCalls: 2,
        expectedToggleState: false,
        newHeight: dialogueSettings.toggleMinimumDisplayHeight - 1,
      });
    });
  });

  describe("when the screen is < threshold vertical size", () => {
    beforeEach(() => {
      window.innerHeight = dialogueSettings.toggleMinimumDisplayHeight - 1;
    });

    describe("with all component props", () => {
      beforeEach(() => {
        arrange();
      });

      checkDialogueProps({ expectedCalls: 2, expectedToggleState: false });
      triggerScreenSizeChange({
        newHeight: dialogueSettings.toggleMinimumDisplayHeight,
        expectedCalls: 3,
        expectedToggleState: true,
      });
    });

    describe("without a BodyComponent", () => {
      beforeEach(() => {
        currentProps.BodyComponent = undefined;

        arrange();
      });

      checkDialogueProps({ expectedCalls: 2, expectedToggleState: false });
      triggerScreenSizeChange({
        newHeight: dialogueSettings.toggleMinimumDisplayHeight,
        expectedCalls: 3,
        expectedToggleState: true,
      });
    });

    describe("without a FooterComponent", () => {
      beforeEach(() => {
        currentProps.FooterComponent = undefined;

        arrange();
      });

      checkDialogueProps({ expectedCalls: 2, expectedToggleState: false });
      triggerScreenSizeChange({
        newHeight: dialogueSettings.toggleMinimumDisplayHeight,
        expectedCalls: 3,
        expectedToggleState: true,
      });
    });

    describe("without a HeaderComponent", () => {
      beforeEach(() => {
        currentProps.HeaderComponent = undefined;

        arrange();
      });

      checkDialogueProps({ expectedCalls: 2, expectedToggleState: false });
      triggerScreenSizeChange({
        newHeight: dialogueSettings.toggleMinimumDisplayHeight,
        expectedCalls: 3,
        expectedToggleState: true,
      });
    });

    describe("without a ToggleComponent", () => {
      beforeEach(() => {
        currentProps.ToggleComponent = undefined;

        arrange();
      });

      checkDialogueProps({ expectedCalls: 2, expectedToggleState: false });
      triggerScreenSizeChange({
        newHeight: dialogueSettings.toggleMinimumDisplayHeight,
        expectedCalls: 3,
        expectedToggleState: true,
      });
    });
  });
});
