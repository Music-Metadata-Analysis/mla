import { Box, Flex } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import Dialogue, { DialogueProps } from "../dialogue.resizable.component";
import { testIDs } from "../dialogue.resizable.identifiers";
import { createSimpleComponent } from "@fixtures/react/simple";
import BillboardContainer from "@src/components/billboard/billboard.base/billboard.container";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import { mockUseRouter } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import type { DialogueInlayComponentType } from "@src/types/components/dialogue.types";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box", "Flex"])
);

jest.mock("@src/components/billboard/billboard.base/billboard.container", () =>
  require("@fixtures/react/parent").createComponent("BillboardContainer")
);

describe("Dialogue", () => {
  let currentProps: DialogueProps;

  const mockT = new MockUseLocale("splash").t;
  const mockBody = createSimpleComponent(testIDs.DialogueBodyComponent);
  const mockFooter = createSimpleComponent(testIDs.DialogueFooterComponent);
  const mockHeader = createSimpleComponent(testIDs.DialogueHeaderComponent);
  const mockToggle = createSimpleComponent(testIDs.DialogueToggleComponent);

  const baseProps: DialogueProps = {
    BodyComponent: mockBody,
    FooterComponent: mockFooter,
    HeaderComponent: mockHeader,
    router: mockUseRouter,
    t: mockT,
    titleText: "mockTitleText",
    ToggleComponent: mockToggle,
    toggleState: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    return render(<Dialogue {...currentProps} />);
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const checkBillboardComponentRender = () => {
    it("should call the Billboard component with the expected props", () => {
      expect(BillboardContainer).toBeCalledTimes(1);
      checkMockCall(
        BillboardContainer,
        {
          titleText: currentProps.titleText,
        },
        0
      );
    });
  };

  const checkChakraFlexComponentRender = () => {
    it("should call the chakra Flex component with the expected props", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(
        Flex,
        {
          direction: "column",
          justify: "center",
          align: "center",
        },
        0
      );
    });
  };

  const checkChakraBoxComponentRender = () => {
    it("should call the chakra Box component the expected number of times", () => {
      let expectedCalls = [
        currentProps.HeaderComponent,
        currentProps.BodyComponent,
        currentProps.FooterComponent,
      ].reduce((total, element) => (element ? total + 1 : total), 0);

      if (currentProps.ToggleComponent && currentProps.toggleState) {
        expectedCalls += 1;
      }

      expect(Box).toBeCalledTimes(expectedCalls);
    });
  };

  const checkOptionalComponentCall = (
    component: DialogueInlayComponentType,
    name: string
  ) => {
    it(`should call the ${name} with the expected props`, () => {
      expect(component).toBeCalledTimes(1);
      checkMockCall(
        component,
        {
          t: currentProps.t,
          router: currentProps.router,
        },
        0
      );
    });
  };

  const checkWrappedInChakraBox = (
    component: DialogueInlayComponentType,
    testId: string,
    name: string
  ) => {
    it(`should wrap the ${name} in a chakra Box component`, async () => {
      const call = jest
        .mocked(Box)
        .mock.calls.find((call) => call[0]["data-testid"] == testId);
      expect(call).toBeDefined();
      expect(
        await within(await screen.findByTestId(testId)).findByText(testId)
      ).toBeTruthy();
    });
  };

  const checkHeaderComponentRender = () => {
    checkOptionalComponentCall(mockHeader, "HeaderComponent");
    checkWrappedInChakraBox(
      mockHeader,
      testIDs.DialogueHeaderComponent,
      "HeaderComponent"
    );
  };

  const checkNoHeaderComponentRender = () => {
    it("should NOT render the HeaderComponent", () => {
      expect(mockHeader).toBeCalledTimes(0);
    });
  };

  const checkToggleComponentRender = () => {
    checkOptionalComponentCall(mockToggle, "ToggleComponent");
    checkWrappedInChakraBox(
      mockToggle,
      testIDs.DialogueToggleComponent,
      "ToggleComponent"
    );
  };

  const checkNoToggleComponentRender = () => {
    it("should NOT render the ToggleComponent", () => {
      expect(mockToggle).toBeCalledTimes(0);
    });
  };

  const checkBodyComponentRender = () => {
    checkOptionalComponentCall(mockBody, "BodyComponent");
    checkWrappedInChakraBox(
      mockBody,
      testIDs.DialogueBodyComponent,
      "BodyComponent"
    );
  };

  const checkNoBodyComponentRender = () => {
    it("should NOT render the BodyComponent", () => {
      expect(mockBody).toBeCalledTimes(0);
    });
  };

  const checkFooterComponentRender = () => {
    checkOptionalComponentCall(mockFooter, "FooterComponent");
    checkWrappedInChakraBox(
      mockFooter,
      testIDs.DialogueFooterComponent,
      "FooterComponent"
    );
  };

  const checkNoFooterComponentRender = () => {
    it("should NOT render the FooterComponent", () => {
      expect(mockFooter).toBeCalledTimes(0);
    });
  };

  describe("with toggleState set to true", () => {
    beforeEach(() => {
      currentProps.toggleState = true;
    });

    describe("with all component props", () => {
      beforeEach(() => {
        arrange();
      });

      checkBillboardComponentRender();
      checkChakraFlexComponentRender();
      checkChakraBoxComponentRender();
      checkHeaderComponentRender();
      checkToggleComponentRender();
      checkBodyComponentRender();
      checkFooterComponentRender();
    });

    describe("without a BodyComponent", () => {
      beforeEach(() => {
        currentProps.BodyComponent = undefined;

        arrange();
      });

      checkBillboardComponentRender();
      checkChakraFlexComponentRender();
      checkChakraBoxComponentRender();
      checkHeaderComponentRender();
      checkToggleComponentRender();
      checkNoBodyComponentRender();
      checkFooterComponentRender();
    });

    describe("without a FooterComponent", () => {
      beforeEach(() => {
        currentProps.FooterComponent = undefined;

        arrange();
      });

      checkBillboardComponentRender();
      checkChakraFlexComponentRender();
      checkChakraBoxComponentRender();
      checkHeaderComponentRender();
      checkToggleComponentRender();
      checkBodyComponentRender();
      checkNoFooterComponentRender();
    });

    describe("without a HeaderComponent", () => {
      beforeEach(() => {
        currentProps.HeaderComponent = undefined;

        arrange();
      });

      checkBillboardComponentRender();
      checkChakraFlexComponentRender();
      checkChakraBoxComponentRender();
      checkNoHeaderComponentRender();
      checkToggleComponentRender();
      checkBodyComponentRender();
      checkFooterComponentRender();
    });

    describe("without a ToggleComponent", () => {
      beforeEach(() => {
        currentProps.ToggleComponent = undefined;

        arrange();
      });

      checkBillboardComponentRender();
      checkChakraFlexComponentRender();
      checkChakraBoxComponentRender();
      checkHeaderComponentRender();
      checkNoToggleComponentRender();
      checkBodyComponentRender();
      checkFooterComponentRender();
    });
  });

  describe("with toggleState set to false", () => {
    beforeEach(() => {
      currentProps.toggleState = false;
    });

    describe("with all component props", () => {
      beforeEach(() => {
        arrange();
      });

      checkBillboardComponentRender();
      checkChakraFlexComponentRender();
      checkChakraBoxComponentRender();
      checkHeaderComponentRender();
      checkNoToggleComponentRender();
      checkBodyComponentRender();
      checkFooterComponentRender();
    });

    describe("without a BodyComponent", () => {
      beforeEach(() => {
        currentProps.BodyComponent = undefined;

        arrange();
      });

      checkBillboardComponentRender();
      checkChakraFlexComponentRender();
      checkChakraBoxComponentRender();
      checkHeaderComponentRender();
      checkNoToggleComponentRender();
      checkNoBodyComponentRender();
      checkFooterComponentRender();
    });

    describe("without a FooterComponent", () => {
      beforeEach(() => {
        currentProps.FooterComponent = undefined;

        arrange();
      });

      checkBillboardComponentRender();
      checkChakraFlexComponentRender();
      checkChakraBoxComponentRender();
      checkHeaderComponentRender();
      checkNoToggleComponentRender();
      checkBodyComponentRender();
      checkNoFooterComponentRender();
    });

    describe("without a HeaderComponent", () => {
      beforeEach(() => {
        currentProps.HeaderComponent = undefined;

        arrange();
      });

      checkBillboardComponentRender();
      checkChakraFlexComponentRender();
      checkChakraBoxComponentRender();
      checkNoHeaderComponentRender();
      checkNoToggleComponentRender();
      checkBodyComponentRender();
      checkFooterComponentRender();
    });

    describe("without a ToggleComponent", () => {
      beforeEach(() => {
        currentProps.ToggleComponent = undefined;

        arrange();
      });

      checkBillboardComponentRender();
      checkChakraFlexComponentRender();
      checkChakraBoxComponentRender();
      checkHeaderComponentRender();
      checkNoToggleComponentRender();
      checkBodyComponentRender();
      checkFooterComponentRender();
    });
  });
});
