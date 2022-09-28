import { Flex } from "@chakra-ui/react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Dialogue from "../dialogue.resizable.component";
import Billboard from "@src/components/billboard/billboard.component";
import Condition from "@src/components/condition/condition.component";
import dialogueSettings from "@src/config/dialogue";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/components/billboard/billboard.component", () =>
  require("@fixtures/react").createComponent("Billboard")
);

jest.mock("@src/components/condition/condition.component", () =>
  require("@fixtures/react").createComponent("Condition")
);

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Flex"]);
});

describe("Dialogue", () => {
  const mockProps = {
    t: jest.fn((arg) => `t(${arg})`),
    titleKey: "mockTitleKey",
    BodyComponent: jest.fn(() => <>MockBodyComponent</>),
    FooterComponent: jest.fn(() => <>MockFooterComponent</>),
    HeaderComponent: jest.fn(() => <>MockHeaderComponent</>),
    ToggleComponent: jest.fn(() => <>MockToggleComponent</>),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Dialogue {...mockProps} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Billboard with the correct props", () => {
      expect(Billboard).toBeCalledTimes(1);
      checkMockCall(Billboard, { title: `t(${mockProps.titleKey})` });
    });

    it("should call Condition with the correct props", () => {
      expect(Condition).toBeCalledTimes(1);
      checkMockCall(Condition, {
        isTrue: true,
      });
    });

    it("should call Flex with the correct props", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(Flex, {
        align: "center",
        direction: "column",
        justify: "center",
      });
    });

    it("should call BodyComponent with the correct props", () => {
      expect(mockProps.BodyComponent).toBeCalledTimes(1);
      checkMockCall(mockProps.BodyComponent, { t: mockProps.t });
    });

    it("should call HeaderComponent with the correct props", () => {
      expect(mockProps.HeaderComponent).toBeCalledTimes(1);
      checkMockCall(mockProps.HeaderComponent, { t: mockProps.t });
    });

    it("should call ToggleComponent with the correct props", () => {
      expect(mockProps.ToggleComponent).toBeCalledTimes(1);
      checkMockCall(mockProps.ToggleComponent, { t: mockProps.t });
    });

    it("should call FooterComponent with the correct props", () => {
      expect(mockProps.FooterComponent).toBeCalledTimes(1);
      checkMockCall(mockProps.FooterComponent, { t: mockProps.t });
    });

    describe("when the screen is resized vertically", () => {
      const originalWindowInnerHeight = window.innerHeight;

      beforeAll(() => {
        Object.defineProperty(window, "innerHeight", {
          writable: true,
          configurable: true,
          value: dialogueSettings.toggleMinimumDisplayHeight - 1,
        });
      });

      beforeEach(async () => {
        fireEvent.resize(window.document);
      });

      afterAll(() => {
        Object.defineProperty(window, "innerHeight", {
          value: originalWindowInnerHeight,
        });
      });

      it("should update the props on the condition element", async () => {
        await waitFor(() => expect(Condition).toBeCalledTimes(2));
        checkMockCall(
          Condition,
          {
            isTrue: true,
          },
          0
        );
        checkMockCall(
          Condition,
          {
            isTrue: false,
          },
          1
        );
      });
    });
  });
});
