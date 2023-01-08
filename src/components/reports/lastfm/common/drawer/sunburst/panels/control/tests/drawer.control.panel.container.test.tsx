import { render } from "@testing-library/react";
import SunBurstDrawerControlPanel from "../drawer.control.panel.component";
import SunBurstDrawerControlPanelContainer, {
  SunBurstDrawerControlPanelContainerProps,
} from "../drawer.control.panel.container";
import MockSunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { d3Node } from "@src/types/reports/generics/sunburst.types";

jest.mock("@src/hooks/locale.hook");

jest.mock("../drawer.control.panel.component", () =>
  require("@fixtures/react/child").createComponent("SunBurstDrawerControlPanel")
);

describe("SunBurstDrawerControlPanelContainer", () => {
  let currentProps: SunBurstDrawerControlPanelContainerProps;

  const mockSelectParentNode = jest.fn();
  const mockLastFMt = new MockUseLocale("lastfm").t;

  const baseProps = {
    node: new MockSunBurstNodeAbstractBase({} as d3Node),
    selectParentNode: mockSelectParentNode,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<SunBurstDrawerControlPanelContainer {...currentProps} />);
  };

  const createMockNode = (data: unknown) =>
    (currentProps.node = new MockSunBurstNodeAbstractBase(data as d3Node));

  const resetProps = () =>
    (currentProps = {
      ...baseProps,
    });

  const checkSunBurstDrawerControlPanelProps = () => {
    it("should render the SunBurstDrawerControlPanel component with the expected props", () => {
      expect(SunBurstDrawerControlPanel).toBeCalledTimes(1);
      checkMockCall(
        SunBurstDrawerControlPanel,
        {
          node: currentProps.node,
          percentageText: mockLastFMt("playCountByArtist.drawer.percentage"),
          selectParentNode: mockSelectParentNode,
          valueText: mockLastFMt("playCountByArtist.drawer.value"),
        },
        0
      );
    });
  };

  describe("when rendered with a root node", () => {
    beforeEach(() => {
      createMockNode({
        data: { name: "mockRootNode", entity: "root" },
        value: 100,
      });
      arrange();
    });

    checkSunBurstDrawerControlPanelProps();
  });

  describe("when rendered with a non-root node", () => {
    beforeEach(() => {
      createMockNode({
        data: { name: "mockNonRootNode", entity: "unknown" },
        value: 100,
        parent: { mock: "node" },
      });
      arrange();
    });

    checkSunBurstDrawerControlPanelProps();
  });
});
