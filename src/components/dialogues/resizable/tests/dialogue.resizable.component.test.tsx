import { Flex } from "@chakra-ui/react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import settings from "../../../../config/dialogue";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import Billboard from "../../../billboard/billboard.component";
import Condition from "../../../condition/condition.component";
import Dialogue from "../dialogue.resizable.component";

jest.mock("../../../billboard/billboard.component", () =>
  createMockedComponent("BillBoard")
);

jest.mock("../../../condition/condition.component", () =>
  createMockedComponent("Condition")
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Flex"]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

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
          value: settings.minimumHeight - 1,
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
