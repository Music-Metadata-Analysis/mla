import { Flex, Box, Stat, StatLabel, StatHelpText } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import SunBurstDetailsPanel, {
  SunBurstDetailsPanelProps,
} from "../details.panel.component";
import { testIDs } from "../details.panel.identifiers";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Flex",
    "Box",
    "Stat",
    "StatLabel",
    "StatHelpText",
  ])
);

describe("SunBurstDetailsPanel", () => {
  let currentProps: SunBurstDetailsPanelProps;

  const mockT = new MockUseTranslation("lastfm").t;

  const baseProps = {
    breakPoints: [100, 200, 300],
    nodeName: "mockNodeName",
    nodeParentName: "mockNodeParentName",
    nodeValue: 100,
    lastFMt: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const resetProps = () => (currentProps = { ...baseProps });

  const arrange = () => {
    render(<SunBurstDetailsPanel {...currentProps} />);
  };

  const checkBoxProps = () => {
    it("should render the chakra Box component with the expected props", () => {
      expect(Box).toBeCalledTimes(3);
      checkMockCall(
        Box,
        {
          mb: 2,
          ml: 2,
          mr: 2,
          mt: 1,
        },
        0
      );
      checkMockCall(
        Box,
        {
          "data-testid": testIDs.SunBurstDetailsPanelParentName,
          style: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        },
        1
      );
      checkMockCall(
        Box,
        {
          "data-testid": testIDs.SunBurstDetailsPanelValue,
        },
        2
      );
    });
  };

  const checkFlexProps = () => {
    it("should render the chakra Flex component with the expected props", () => {
      expect(Flex).toBeCalledTimes(2);
      checkMockCall(Flex, {}, 0);
      checkMockCall(Flex, {}, 1);
    });
  };

  const checkStatProps = () => {
    it("should render the chakra Stat component with the expected props", () => {
      expect(Stat).toBeCalledTimes(1);
      checkMockCall(Stat, {}, 0);
    });
  };

  const checkStatLabelProps = () => {
    it("should render the chakra StatLabel component with the expected props", () => {
      expect(StatLabel).toBeCalledTimes(1);
      checkMockCall(
        StatLabel,
        {
          "data-testid": testIDs.SunBurstDetailsPanelName,
          style: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
          w: [10, 110, 210],
        },
        0
      );
    });
  };

  const checkStatHelpTextProps = () => {
    it("should render the chakra StatHelpText component with the expected props", () => {
      expect(StatHelpText).toBeCalledTimes(1);
      checkMockCall(
        StatHelpText,
        {
          w: [10, 110, 210],
        },
        0
      );
    });
  };

  const checkNodeName = () => {
    it("should render the node's name correctly", async () => {
      const container = await screen.findByTestId(
        testIDs.SunBurstDetailsPanelName
      );
      expect(
        await within(container).findByText(currentProps.nodeName)
      ).toBeTruthy();
    });
  };

  const checkNodeParentName = () => {
    it("should render the node's parent's name correctly", async () => {
      const container = await screen.findByTestId(
        testIDs.SunBurstDetailsPanelParentName
      );
      expect(
        await within(container).findByText(String(currentProps.nodeParentName))
      ).toBeTruthy();
    });

    it("should render brackets around the node's parent's name", async () => {
      const container = (await screen.findByTestId(
        testIDs.SunBurstDetailsPanelParentName
      )) as HTMLElement;

      expect(container.previousSibling?.textContent).toBe("(");
      expect(container.nextSibling?.textContent).toBe(")");
    });
  };

  const checkNodeNoParent = () => {
    it("should NOT render anything with respect to the node's parent's name", async () => {
      const container = (
        await screen.findByTestId(testIDs.SunBurstDetailsPanelParentName)
      ).parentElement as HTMLElement;

      expect(container.previousSibling?.textContent).toBeUndefined();
      expect(container.nextSibling?.textContent).toBeUndefined();
    });
  };

  const checkNodeValue = () => {
    it("should render a translation for the node's value indicator", async () => {
      const container = await screen.findByTestId(
        testIDs.SunBurstDetailsPanelValue
      );
      expect(
        await within(container).findByText(
          mockT("playCountByArtist.panel.value") + ":"
        )
      ).toBeTruthy();
    });

    it("should render the node's value correctly", async () => {
      const container = await screen.findByTestId(
        testIDs.SunBurstDetailsPanelValue
      );
      expect(
        await within(container).findByText(currentProps.nodeValue)
      ).toBeTruthy();
    });
  };

  describe("with a node that has a parent", () => {
    beforeEach(() => {
      currentProps.nodeParentName = "mockNodeParentName";

      arrange();
    });

    checkBoxProps();
    checkFlexProps();
    checkStatProps();
    checkStatLabelProps();
    checkStatHelpTextProps();
    checkNodeName();
    checkNodeParentName();
    checkNodeValue();
  });

  describe("with a node that has NO parent", () => {
    beforeEach(() => {
      currentProps.nodeParentName = null;

      arrange();
    });

    checkBoxProps();
    checkFlexProps();
    checkStatProps();
    checkStatLabelProps();
    checkStatHelpTextProps();
    checkNodeName();
    checkNodeNoParent();
    checkNodeValue();
  });
});
