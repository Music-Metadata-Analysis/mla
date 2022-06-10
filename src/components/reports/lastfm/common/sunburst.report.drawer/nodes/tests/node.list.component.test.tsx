import { Flex, Text } from "@chakra-ui/react";
import { act, render, screen, within } from "@testing-library/react";
import lastfm from "../../../../../../../../public/locales/en/lastfm.json";
import mockColourHook from "../../../../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../../../../tests/fixtures/mock.component.call";
import VerticalScrollBar from "../../../../../../scrollbar/vertical.scrollbar.component";
import MockSunBurstNodeEncapsulation from "../../../sunburst.report/encapsulations/tests/fixtures/mock.sunburst.node.encapsulation.class";
import SunBurstNodeButton from "../node.button.component";
import SunBurstNodeDisplay from "../node.display.component";
import SunBurstEntityNodeList, {
  testIDs,
  SunBurstEntityNodeListProps,
} from "../node.list.component";
import type { d3Node } from "../../../../../../../types/reports/sunburst.types";
import type SunBurstNodeEncapsulation from "../../../sunburst.report/encapsulations/sunburst.node.encapsulation.base";

jest.mock("../../../../../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock("../../../../../../scrollbar/vertical.scrollbar.component", () =>
  createMockedComponent("VerticalScrollBar")
);

jest.mock("../node.button.component", () =>
  createMockedComponent("SunBurstNodeButton")
);

jest.mock("../node.display.component", () =>
  createMockedComponent("SunBurstNodeDisplay")
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Flex", "Text"]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("SunBurstEntityNodeList", () => {
  let mockNode: SunBurstNodeEncapsulation;
  let mockSvgTransition: boolean;
  const mockSelectNode = jest.fn();
  let currentProps: SunBurstEntityNodeListProps;
  const mockSunBurstT = jest.fn((key: string) => `sunBurstT(${key})`);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockNode = (data: unknown) =>
    (mockNode = new MockSunBurstNodeEncapsulation(data as d3Node));

  const createProps = () =>
    (currentProps = {
      node: mockNode as SunBurstNodeEncapsulation,
      scrollRef: { current: null },
      selectChildNode: mockSelectNode,
      svgTransition: mockSvgTransition,
    });

  const arrange = () => {
    createProps();
    render(<SunBurstEntityNodeList {...currentProps} />);
  };

  const checkChakraComponents = () => {
    describe("when the chakra ui components are rendered", () => {
      it("should render Flex with the expected props", () => {
        expect(Flex).toBeCalledTimes(1);

        checkMockCall(
          Flex,
          {
            "data-testid": testIDs.SunBurstEntityNodeList,
            flexDirection: "column",
          },
          0,
          []
        );
      });

      it("should render Text with the expected props", () => {
        expect(Text).toBeCalledTimes(1);

        checkMockCall(
          Text,
          {
            "data-testid": testIDs.SunBurstEntityNodeListTitle,
            mb: "10px",
            fontSize: "sm",
          },
          0,
          []
        );
      });
    });
  };

  const checkTextContent = ({ list }: { list: boolean }) => {
    if (list) {
      it("should render the list title as expected", async () => {
        const container = await screen.findByTestId(
          testIDs.SunBurstEntityNodeListTitle
        );

        expect(
          await within(container).findByText(
            mockNode.getDrawerListTitle(mockSunBurstT) as string
          )
        ).toBeTruthy();
      });
    } else {
      it("should render the no information message", async () => {
        const container = await screen.findByTestId(
          testIDs.SunBurstEntityNodeListTitle
        );
        expect(
          await within(container).findByText(
            lastfm.playCountByArtist.drawer.noInformation
          )
        ).toBeTruthy();
      });
    }
  };

  const checkEntityComponent = ({
    count,
    component,
  }: {
    count: number;
    component: typeof SunBurstNodeButton | typeof SunBurstNodeDisplay;
  }) => {
    it("should call the correct entity component with the correct props", () => {
      const childNodes = currentProps.node.getChildren();
      expect(childNodes.length).toBe(count);

      expect(component).toBeCalledTimes(count);
      const calls = (component as jest.Mock).mock.calls;
      for (let index = 0; index < count; index++) {
        const call = calls[index][0];
        expect(call.index).toBe(index);
        expect(call.node).toBeInstanceOf(MockSunBurstNodeEncapsulation);
        expect(call.node.getNode()).toStrictEqual(childNodes[index].getNode());
        expect(typeof call.selectChildNode).toBe("function");
      }
    });

    if (component === SunBurstNodeButton && count > 0) {
      describe("when entity selection buttons are rendered", () => {
        describe.each([...Array(count).keys()])(
          "when the button %s's selectChildNode function is triggered",
          (index) => {
            let child: SunBurstNodeEncapsulation;

            beforeEach(async () => {
              child = currentProps.node.getChildren()[index];
              const selectChildNode = (component as jest.Mock).mock.calls[
                index
              ][0].selectChildNode;
              act(() => selectChildNode(child));
            });

            it("should call the selection function on that node", () => {
              expect(currentProps.selectChildNode).toBeCalledTimes(1);
              expect(currentProps.selectChildNode).toBeCalledWith(child);
            });
          }
        );
      });
    }
  };

  const checkScrollBarComponent = () => {
    it("should call the ScrollBar component correctly", () => {
      expect(VerticalScrollBar).toBeCalledTimes(1);
      checkMockCall(
        VerticalScrollBar,
        {
          scrollRef: currentProps.scrollRef,
          update: currentProps.node.getNodeName(),
          horizontalOffset: 10,
          verticalOffset: 0,
          zIndex: 5000,
        },
        0
      );
    });
  };

  describe("when svgTransition is false", () => {
    beforeEach(() => (mockSvgTransition = false));

    describe("when the a node is selected, and the children property is missing", () => {
      beforeEach(() => {
        const mockRootNode = {
          data: { name: "Mock Root", entity: "root" },
          value: 100,
        } as d3Node;
        createMockNode(mockRootNode);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkChakraComponents();
        checkTextContent({ list: false });
        checkEntityComponent({ component: SunBurstNodeButton, count: 0 });
        checkScrollBarComponent();
      });
    });

    describe("when the root node is selected, and there are non-leaf children present", () => {
      beforeEach(() => {
        const mockRootNode = {
          data: { name: "Mock Root", entity: "root" },
          children: [
            {
              data: {
                name: "Artist1",
                entity: "artists",
              },
              value: 50,
              children: [
                { data: { name: "Album1", entity: "albums" }, value: 25 },
                { data: { name: "Album2", entity: "albums" }, value: 25 },
              ],
            },
            {
              data: {
                name: "Artist2",
                entity: "artists",
              },
              value: 50,
              children: [
                { data: { name: "Album1", entity: "albums" }, value: 25 },
                { data: { name: "Album2", entity: "albums" }, value: 25 },
              ],
            },
          ],
          value: 100,
        } as d3Node;
        createMockNode(mockRootNode);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkChakraComponents();
        checkTextContent({ list: true });
        checkEntityComponent({ component: SunBurstNodeButton, count: 2 });
        checkScrollBarComponent();
      });
    });

    describe("when a node is selected, and there are leaf children present", () => {
      beforeEach(() => {
        const mockNonRootNode = {
          data: {
            name: "Album1",
            entity: "albums",
          },
          children: [
            { data: { name: "Track1", entity: "tracks" } },
            { data: { name: "Track2", entity: "tracks" } },
          ],
          value: 50,
          parent: {
            data: { name: "Artist1", entity: "artists" },
            value: 100,
          },
        } as d3Node;
        createMockNode(mockNonRootNode);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkChakraComponents();
        checkTextContent({ list: true });
        checkEntityComponent({ component: SunBurstNodeDisplay, count: 2 });
        checkScrollBarComponent();
      });
    });
  });

  describe("when svgTransition is true", () => {
    beforeEach(() => (mockSvgTransition = true));

    describe("when the a node is selected, and the children property is missing", () => {
      beforeEach(() => {
        const mockRootNode = {
          data: { name: "Mock Root", entity: "root" },
          value: 100,
        } as d3Node;
        createMockNode(mockRootNode);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        it("should not render any chakra components", () => {
          expect(Flex).toBeCalledTimes(0);
          expect(Text).toBeCalledTimes(0);
        });

        it("should not render any entity components", () => {
          expect(SunBurstNodeButton).toBeCalledTimes(0);
          expect(SunBurstNodeDisplay).toBeCalledTimes(0);
        });

        it("should not render the scrollbar", () => {
          expect(VerticalScrollBar).toBeCalledTimes(0);
        });
      });
    });
  });
});
