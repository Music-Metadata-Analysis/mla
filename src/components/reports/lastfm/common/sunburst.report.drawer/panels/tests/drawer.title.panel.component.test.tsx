import { Container, Text } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import SunBurstDrawerTitlePanel, {
  testIDs,
  SunBurstDrawerTitlePanelProps,
} from "../drawer.title.panel.component";
import MockSunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type SunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/sunburst.node.encapsulation.base";
import type { d3Node } from "@src/types/reports/sunburst.types";

jest.mock("@src/hooks/locale");

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Container", "Text"]);
});

describe("SunBurstDrawerTitlePanel", () => {
  let currentProps: SunBurstDrawerTitlePanelProps;
  let mockNode: SunBurstNodeEncapsulation;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockNode = (data: unknown) =>
    (mockNode = new MockSunBurstNodeEncapsulation(data as d3Node));

  const createProps = () =>
    (currentProps = {
      node: mockNode,
    });

  const arrange = () => {
    createProps();
    render(<SunBurstDrawerTitlePanel {...currentProps} />);
  };

  const checkChakraComponents = () => {
    it("should render Container with the expected props", () => {
      expect(Container).toBeCalledTimes(1);

      checkMockCall(
        Container,
        {
          m: 0,
          p: 0,
          w: "80%",
          overflowWrap: "anywhere",
        },
        0,
        []
      );
    });

    it("should call Text with the expected props", () => {
      expect(Text).toBeCalledTimes(2);

      checkMockCall(
        Text,
        {
          "data-testid": testIDs.LastFMSunBurstDrawerTitle,
          fontSize: "md",
        },
        0,
        []
      );
      checkMockCall(
        Text,
        {
          "data-testid": testIDs.LastFMSunBurstDrawerSubTitle,
          fontSize: "sm",
        },
        1,
        []
      );
    });
  };

  const checkText = ({ parent }: { parent: boolean }) => {
    it("should render the drawer title as expected", async () => {
      const container = await screen.findByTestId(
        testIDs.LastFMSunBurstDrawerTitle
      );
      expect(
        await within(container).findByText(mockNode.getDrawerTitle())
      ).toBeTruthy();
    });

    if (parent) {
      it("should render the drawer ub-title as expected", async () => {
        const container = await screen.findByTestId(
          testIDs.LastFMSunBurstDrawerSubTitle
        );
        expect(
          await within(container).findByText(
            (("(" + mockNode.getDrawerSubTitle(jest.fn())) as string) + ")"
          )
        ).toBeTruthy();
      });
    } else {
      it("should not render a drawer subtitle", async () => {
        const container = await screen.findByTestId(
          testIDs.LastFMSunBurstDrawerSubTitle
        );
        expect(container).toHaveTextContent("");
      });
    }
  };

  describe("when rendered with a root node", () => {
    beforeEach(() => {
      createMockNode({
        data: { name: "mockRootNode", entity: "root" },
        value: 100,
      });
      arrange();
    });

    checkChakraComponents();
    checkText({ parent: false });
  });

  describe("when rendered with a non-root node", () => {
    beforeEach(() => {
      createMockNode({
        data: { name: "mockNonRootNode", entity: "unknown" },
        value: 100,
      });
      arrange();
    });

    checkChakraComponents();
    checkText({ parent: true });
  });
});
