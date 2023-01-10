import MockSunBurstData from "./data/sunburst.node.data.set.json";
import MockSunBurstNodeAbstractBase from "./implementations/concrete.sunburst.node.encapsulation.class";
import Events from "@src/events/events";
import RGBA from "@src/utils/colours/rgba.class";
import type SunBurstNodeAbstractBase from "../sunburst.node.encapsulation.base.class";
import type EventDefinition from "@src/contracts/events/event.class";
import type {
  d3Node,
  SunBurstData,
} from "@src/types/reports/generics/sunburst.types";

type d3NodeWithChildren = d3Node & { children: Array<d3NodeWithChildren> };

jest.mock("@src/utils/strings");

jest.mock("@src/events/events", () => ({
  LastFM: { SunBurstNodeSelected: jest.fn(() => "MockEvent!") },
}));

describe("SunBurstNodeAbstractBase", () => {
  let instance: SunBurstNodeAbstractBase;
  let node: d3NodeWithChildren;
  const entityType: SunBurstData["entity"] = "tracks";

  beforeEach(() => jest.clearAllMocks());

  const copyJSON = (source: unknown) =>
    JSON.parse(JSON.stringify(source)) as d3NodeWithChildren;

  const arrange = () => {
    instance = new MockSunBurstNodeAbstractBase(node);
  };

  const testDrawerEvent = ({ expected }: { expected: Array<string> }) => {
    describe("getDrawerEvent", () => {
      let result: EventDefinition;

      beforeEach(() => (result = instance.getDrawerEvent()));

      it("should return the mocked event value", () => {
        expect(result).toBe("MockEvent!");
      });

      it("should call the event generator with the correct values", () => {
        expect(Events.LastFM.SunBurstNodeSelected).toBeCalledWith(...expected);
      });
    });
  };

  const testChildMethods = () => {
    describe("getChildren", () => {
      let result: Array<SunBurstNodeAbstractBase>;

      beforeEach(() => (result = instance.getChildren()));

      it("should return an array of encapsulated d3 node children", () => {
        result.forEach((child, index) => {
          expect(child).toBeInstanceOf(MockSunBurstNodeAbstractBase);
          expect(child.getNode()).toStrictEqual(node.children[index]);
          expect(child.getLeafEntityType()).toBe(instance.getLeafEntityType());
        });
        expect(result.length).toBe(node.children.length);
      });
    });

    describe("getChildEntity", () => {
      let result: string;

      beforeEach(() => (result = instance.getChildEntity()));

      it("should return the children's entity type", () => {
        expect(result).toBe(
          (node.data.children as Array<SunBurstData>)[0].entity
        );
      });
    });
  };

  const testLeafEntityMethods = () => {
    describe("getLeafEntityType", () => {
      let result: SunBurstData["entity"];

      beforeEach(() => (result = instance.getLeafEntityType()));

      it("should return the leaf entity type of the SunBurst tree", () => {
        expect(result).toBe(entityType);
      });
    });
  };

  const testNodeMethods = () => {
    describe("getNode", () => {
      let result: d3Node;

      beforeEach(() => (result = instance.getNode()));

      it("should return the original d3 node", () => {
        expect(result).toBe(node);
      });
    });

    describe("getNodeEntity", () => {
      let result: string;

      beforeEach(() => (result = instance.getNodeEntity()));

      it("should return the d3 node's entity type", () => {
        expect(result).toBe(node.data.entity);
      });
    });

    describe("getNodeName", () => {
      let result: string;

      beforeEach(() => (result = instance.getNodeName()));

      it("should return the d3 node's name", () => {
        expect(result).toBe(node.data.name);
      });
    });

    describe("with a RBGA colour assigned", () => {
      const mockRGBAvalue = "rgba(1,2,3,0)";

      describe("getNodeColor", () => {
        let result: string;

        beforeEach(() => {
          instance.getNode().colour = new RGBA(mockRGBAvalue);
          result = instance.getNodeColour();
        });

        it("should return the rgba value", () => {
          expect(result).toBe(mockRGBAvalue);
        });
      });
    });
  };

  const testValueMethods = () => {
    describe("getSunBurstTotal", () => {
      let result: number;

      beforeEach(() => (result = instance.getSunBurstTotal()));

      it("should return the expected results", () => {
        expect(result).toBe(MockSunBurstData.value);
      });
    });

    describe("getValuePercentage", () => {
      let result: number;

      beforeEach(() => (result = instance.getValuePercentage()));

      it("should return the expected results", () => {
        expect(result).toBe(
          ((node.value as number) / MockSunBurstData.value) * 100
        );
      });
    });
  };

  describe("with a root SunBurstNode", () => {
    beforeEach(() => (node = copyJSON(MockSunBurstData)));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      testChildMethods();

      describe("hasLeafChildren", () => {
        let result: boolean;

        beforeEach(() => (result = instance.hasLeafChildren()));

        it("should return false", () => {
          expect(result).toBeFalsy();
        });
      });

      testDrawerEvent({
        expected: ["SINGULAR(ROOT)", "Top Artists"],
      });

      testLeafEntityMethods();

      testNodeMethods();

      describe("getParent", () => {
        let result: d3Node | null;

        beforeEach(() => (result = instance.getParent()));

        it("should return the expected results", () => {
          expect(result).toBe(null);
        });
      });

      describe("getParentName", () => {
        let result: string | null;

        beforeEach(() => (result = instance.getParentName()));

        it("should return the expected results", () => {
          expect(result).toBe(null);
        });
      });

      testValueMethods();

      describe("getValue", () => {
        let result: number;

        beforeEach(() => (result = instance.getValue()));

        it("should return the expected results", () => {
          expect(result).toBe(node.value);
        });
      });
    });
  });

  describe("with a non-root SunBurstNode", () => {
    beforeEach(() => {
      node = copyJSON(MockSunBurstData.children[1]);
      node.parent = copyJSON(MockSunBurstData);
    });

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      testChildMethods();

      describe("hasLeafChildren", () => {
        let result: boolean;

        beforeEach(() => (result = instance.hasLeafChildren()));

        it("should return false", () => {
          expect(result).toBeFalsy();
        });
      });

      testDrawerEvent({
        expected: ["SINGULAR(ARTISTS)", "Lights & Motion"],
      });

      testLeafEntityMethods();

      testNodeMethods();

      describe("getParent", () => {
        let result: d3Node | null;

        beforeEach(() => (result = instance.getParent()));

        it("should return the expected results", () => {
          expect(result).toStrictEqual(MockSunBurstData);
        });
      });

      describe("getParentName", () => {
        let result: string | null;

        beforeEach(() => (result = instance.getParentName()));

        it("should return the expected results", () => {
          expect(result).toBe(MockSunBurstData.data.name);
        });
      });

      testValueMethods();

      describe("getValue", () => {
        let result: number;

        beforeEach(() => (result = instance.getValue()));

        it("should return the expected results", () => {
          expect(result).toBe(node.value);
        });
      });
    });
  });

  describe("with a leaf-parent SunBurstNode", () => {
    let parent: d3NodeWithChildren;

    beforeEach(() => {
      node = copyJSON(MockSunBurstData).children[1].children[0];
      parent = copyJSON(MockSunBurstData.children[1]);
      node.parent = parent;
      parent.parent = copyJSON(MockSunBurstData);
    });

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      testChildMethods();

      describe("hasLeafChildren", () => {
        let result: boolean;

        beforeEach(() => (result = instance.hasLeafChildren()));

        it("should return true", () => {
          expect(result).toBeTruthy();
        });
      });

      testDrawerEvent({
        expected: ["SINGULAR(ALBUMS)", "Reanimation"],
      });

      testLeafEntityMethods();

      testNodeMethods();

      describe("getParent", () => {
        let result: d3Node | null;

        beforeEach(() => (result = instance.getParent()));

        it("should return the expected results", () => {
          expect(result).toStrictEqual(parent);
        });
      });

      describe("getParentName", () => {
        let result: string | null;

        beforeEach(() => (result = instance.getParentName()));

        it("should return the expected results", () => {
          expect(result).toBe(MockSunBurstData.children[1].data.name);
        });
      });

      testValueMethods();

      describe("getValue", () => {
        let result: number;

        beforeEach(() => (result = instance.getValue()));

        it("should return the expected results", () => {
          expect(result).toBe(node.value);
        });
      });
    });
  });

  describe("with a leaf SunBurstNode", () => {
    let parent: d3NodeWithChildren;

    beforeEach(() => {
      node = copyJSON(MockSunBurstData).children[1].children[0].children[0];
      parent = copyJSON(MockSunBurstData).children[1].children[0];
      const intermediaryParent = copyJSON(MockSunBurstData).children[1];
      const root = copyJSON(MockSunBurstData);
      node.parent = parent;
      parent.parent = intermediaryParent;
      parent.parent.parent = root;
    });

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      describe("getChildren", () => {
        let result: Array<SunBurstNodeAbstractBase>;

        beforeEach(() => (result = instance.getChildren()));

        it("should return the expected results", () => {
          expect(result).toStrictEqual([]);
        });
      });

      describe("getChildEntity", () => {
        let result: string;

        beforeEach(() => (result = instance.getChildEntity()));

        it("should return 'unknown'", () => {
          expect(result).toBe("unknown");
        });
      });

      describe("hasLeafChildren", () => {
        let result: boolean;

        beforeEach(() => (result = instance.hasLeafChildren()));

        it("should return false", () => {
          expect(result).toBeFalsy();
        });
      });

      testDrawerEvent({
        expected: ["SINGULAR(TRACKS)", "Requiem"],
      });

      testLeafEntityMethods();

      testNodeMethods();

      describe("getParent", () => {
        let result: d3Node | null;

        beforeEach(() => (result = instance.getParent()));

        it("should return the expected results", () => {
          expect(result).toStrictEqual(parent);
        });
      });

      describe("getParentName", () => {
        let result: string | null;

        beforeEach(() => (result = instance.getParentName()));

        it("should return the expected results", () => {
          expect(result).toBe(
            (MockSunBurstData as d3NodeWithChildren).children[1].children[0]
              .data.name
          );
        });
      });

      testValueMethods();

      describe("getValue", () => {
        let result: number;

        beforeEach(() => (result = instance.getValue()));

        it("should return the expected results", () => {
          expect(result).toBe(0);
        });
      });
    });
  });
});
