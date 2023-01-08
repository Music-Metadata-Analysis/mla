import { render } from "@testing-library/react";
import { useRef } from "react";
import LastFMSunBurstDrawer from "../sunburst.report.drawer.component";
import LastFMSunBurstDrawerContainer from "../sunburst.report.drawer.container";
import MockSunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { d3Node } from "@src/types/reports/generics/sunburst.types";
import type { LastFMSunBurstDrawerInterface } from "@src/types/reports/lastfm/components/drawers/sunburst.types";
import type { RefObject } from "react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(),
}));

jest.mock("../sunburst.report.drawer.component", () =>
  require("@fixtures/react/child").createComponent("SunBurstReportDrawer")
);

describe("LastFMSunBurstDrawerContainer", () => {
  let currentProps: LastFMSunBurstDrawerInterface;

  const mockClose = jest.fn();
  const mockD3Node = { name: "mockD3Node" } as unknown as d3Node;
  const mockSelectNode = jest.fn();
  const mockRef = {
    current: null,
    mocked: true,
  } as RefObject<HTMLDivElement>;

  const mockReportState = {
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

  const baseProps = {
    alignment: "left" as const,
    isOpen: true,
    onClose: mockClose,
    node: new MockSunBurstNodeAbstractBase(mockReportState),
    setSelectedNode: mockSelectNode,
    svgTransition: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    createProps();
  });

  const arrange = () => {
    render(<LastFMSunBurstDrawerContainer {...currentProps} />);
  };

  const createProps = () => {
    jest.mocked(useRef).mockReturnValueOnce(mockRef);

    currentProps = {
      ...baseProps,
    };
  };

  const checkLastFMSunBurstDrawer = () => {
    it("should call the LastFMSunBurstDrawer component with the correct props", () => {
      expect(LastFMSunBurstDrawer).toBeCalledTimes(1);
      checkMockCall(
        LastFMSunBurstDrawer,
        {
          alignment: currentProps.alignment,
          isOpen: currentProps.isOpen,
          node: currentProps.node,
          nodeListScrollRef: mockRef,
          onClose: currentProps.onClose,
          svgTransition: currentProps.svgTransition,
        },
        0,
        ["selectChildNode", "selectParentNode"]
      );
    });
  };

  const checkSelectChildNodeFunction = () => {
    describe("selectChildNode", () => {
      beforeEach(() => {
        const mockEncapsulatedNode = new MockSunBurstNodeAbstractBase(
          mockReportState
        );

        mockEncapsulatedNode.getNode = jest
          .fn()
          .mockReturnValueOnce(mockD3Node);

        const fn =
          jest.mocked(LastFMSunBurstDrawer).mock.calls[0][0].selectChildNode;
        fn(mockEncapsulatedNode);
      });

      it("should attempt to select the d3Node of the passed EncapsulatedNode", () => {
        expect(currentProps.setSelectedNode).toBeCalledTimes(1);
        expect(currentProps.setSelectedNode).toBeCalledWith(mockD3Node);
      });
    });
  };

  const checkSelectParentNodeFunction = () => {
    describe("selectParentNode", () => {
      beforeEach(() => {
        const fn =
          jest.mocked(LastFMSunBurstDrawer).mock.calls[0][0].selectParentNode;
        fn();
      });

      it("should attempt to select the d3Node of the parent of the EncapsulatedNode", () => {
        expect(currentProps.setSelectedNode).toBeCalledTimes(1);
        expect(currentProps.setSelectedNode).toBeCalledWith(
          mockReportState.parent
        );
      });
    });
  };

  describe("when the drawer is Open", () => {
    beforeEach(() => {
      currentProps.isOpen = true;
    });

    describe("when there is a SVG transition", () => {
      beforeEach(() => {
        currentProps.svgTransition = true;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          currentProps.alignment = "left";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkLastFMSunBurstDrawer();
          checkSelectChildNodeFunction();
          checkSelectParentNodeFunction();
        });
      });

      describe("when the alignment is RIGHT", () => {
        beforeEach(() => {
          currentProps.alignment = "right";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkLastFMSunBurstDrawer();
          checkSelectChildNodeFunction();
          checkSelectParentNodeFunction();
        });
      });
    });

    describe("when there is NOT a SVG transition", () => {
      beforeEach(() => {
        currentProps.svgTransition = false;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          currentProps.alignment = "left";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkLastFMSunBurstDrawer();
          checkSelectChildNodeFunction();
          checkSelectParentNodeFunction();
        });
      });

      describe("when the alignment is RIGHT", () => {
        beforeEach(() => {
          currentProps.alignment = "right";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkLastFMSunBurstDrawer();
          checkSelectChildNodeFunction();
          checkSelectParentNodeFunction();
        });
      });
    });
  });

  describe("when the drawer is Closed", () => {
    beforeEach(() => {
      currentProps.isOpen = false;
    });

    describe("when there is a SVG transition", () => {
      beforeEach(() => {
        currentProps.svgTransition = true;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          currentProps.alignment = "left";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkLastFMSunBurstDrawer();
          checkSelectChildNodeFunction();
          checkSelectParentNodeFunction();
        });
      });

      describe("when the alignment is RIGHT", () => {
        beforeEach(() => {
          currentProps.alignment = "right";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkLastFMSunBurstDrawer();
          checkSelectChildNodeFunction();
          checkSelectParentNodeFunction();
        });
      });
    });

    describe("when there is NOT a SVG transition", () => {
      beforeEach(() => {
        currentProps.svgTransition = false;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          currentProps.alignment = "left";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkLastFMSunBurstDrawer();
          checkSelectChildNodeFunction();
          checkSelectParentNodeFunction();
        });
      });

      describe("when the alignment is RIGHT", () => {
        beforeEach(() => {
          currentProps.alignment = "right";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkLastFMSunBurstDrawer();
          checkSelectChildNodeFunction();
          checkSelectParentNodeFunction();
        });
      });
    });
  });
});
