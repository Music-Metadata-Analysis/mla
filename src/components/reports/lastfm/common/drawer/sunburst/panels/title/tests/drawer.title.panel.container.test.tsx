import { render } from "@testing-library/react";
import SunBurstDrawerTitlePanel from "../drawer.title.panel.component";
import SunBurstDrawerTitlePanelContainer, {
  SunBurstDrawerTitlePanelContainerProps,
} from "../drawer.title.panel.container";
import MockSunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import { _t } from "@src/hooks/__mocks__/locale.mock";
import useLocale from "@src/hooks/locale";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { d3Node } from "@src/types/reports/sunburst.types";

jest.mock("@src/hooks/locale");

jest.mock("../drawer.title.panel.component", () =>
  require("@fixtures/react/child").createComponent("SunBurstDrawerTitlePanel")
);

describe("SunBurstDrawerTitlePanelContainer", () => {
  let currentProps: SunBurstDrawerTitlePanelContainerProps;

  const baseProps = {
    node: new MockSunBurstNodeEncapsulation({} as d3Node),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const createMockNode = (data: d3Node) =>
    (currentProps.node = new MockSunBurstNodeEncapsulation(data as d3Node));

  const resetProps = () => {
    jest.mocked(useLocale).mockReturnValueOnce({ t: _t });
    currentProps = { ...baseProps };
  };

  const arrange = () => {
    render(<SunBurstDrawerTitlePanelContainer {...currentProps} />);
  };

  const checkSunBurstDrawerTitlePanelProps = ({
    expectedSubTitleText,
  }: {
    expectedSubTitleText: string;
  }) => {
    it("should call the SunBurstDrawerTitlePanel component with the correct props", () => {
      expect(SunBurstDrawerTitlePanel).toBeCalledTimes(1);
      checkMockCall(
        SunBurstDrawerTitlePanel,
        {
          titleText: currentProps.node.getDrawerTitle(),
          subTitleText: expectedSubTitleText,
        },
        0
      );
    });
  };

  describe("when rendered with a root node", () => {
    const mockNode = {
      data: { name: "mockRootNode", entity: "root" },
      value: 100,
    } as d3Node;

    beforeEach(() => {
      createMockNode(mockNode);
      arrange();
    });

    checkSunBurstDrawerTitlePanelProps({ expectedSubTitleText: "\u00A0" });
  });

  describe("when rendered with a non-root node", () => {
    const mockNode = {
      data: { name: "mockNonRootNode", entity: "unknown" },
      value: 100,
    } as d3Node;
    const expectedSubTitleText = `(${new MockSunBurstNodeEncapsulation(
      mockNode
    ).getDrawerSubTitle(_t)})`;

    beforeEach(() => {
      createMockNode(mockNode);
      arrange();
    });

    checkSunBurstDrawerTitlePanelProps({
      expectedSubTitleText,
    });
  });
});