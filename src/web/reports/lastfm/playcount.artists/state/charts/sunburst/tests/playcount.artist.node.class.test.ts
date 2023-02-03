import PlayCountByArtistNodeEncapsulation from "../playcount.artists.node.class";
import sunburstTranslations from "@locales/sunburst.json";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import SunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type { d3Node } from "@src/web/reports/generics/types/charts/sunburst.types";

jest.mock("@src/utilities/generics/strings");

describe(PlayCountByArtistNodeEncapsulation.name, () => {
  let instance: PlayCountByArtistNodeEncapsulation;
  let mockNode: d3Node;
  const expectedLeafEntity = "tracks";
  const mockT = new MockUseTranslation("sunburst").t;

  const createProps = (nodeData: unknown) => {
    mockNode = nodeData as d3Node;
  };

  const getNode = () => {
    return mockNode as d3Node & { value: number };
  };
  const getParentNode = () => {
    return mockNode.parent as d3Node & { value: number };
  };

  const arrange = () =>
    (instance = new PlayCountByArtistNodeEncapsulation(mockNode));

  const checkInstance = () => {
    it("should be a subclass of SunBurstNodeAbstractBase", () => {
      expect(instance).toBeInstanceOf(SunBurstNodeAbstractBase);
      expect(instance.leafEntity).toBe(expectedLeafEntity);
    });
  };

  const checkGetDrawerEntityListPercentage = ({
    expected,
  }: {
    expected: string;
  }) => {
    describe("getDrawerPercentage", () => {
      let result: string;

      beforeEach(() => (result = instance.getDrawerEntityListPercentage()));

      it(`should return the correct result: ${expected}`, () => {
        expect(result).toBe(expected);
      });
    });
  };

  const checkGetDrawerListTitle = ({
    expected,
  }: {
    expected: string | null;
  }) => {
    describe("getDrawerListTitle", () => {
      let result: string | null;

      beforeEach(() => (result = instance.getDrawerListTitle(mockT)));

      it("should return the correct result", () => {
        expect(result).toBe(expected);
      });
    });
  };

  const checkGetDrawerPercentage = ({ expected }: { expected: string }) => {
    describe("getDrawerPercentage", () => {
      let result: string;

      beforeEach(() => (result = instance.getDrawerPercentage()));

      it(`should return the correct result: ${expected}`, () => {
        expect(result).toBe(expected);
      });
    });
  };

  const checkGetDrawerSubTitle = ({
    expected,
  }: {
    expected: string | null;
  }) => {
    describe("getDrawerSubTitle", () => {
      let result: string | null;

      beforeEach(() => (result = instance.getDrawerSubTitle()));

      it("should return the correct result", () => {
        expect(result).toBe(expected);
      });
    });
  };

  const checkGetDrawerTitle = ({ expected }: { expected: string }) => {
    describe("getDrawerTitle", () => {
      let result: string;

      beforeEach(() => (result = instance.getDrawerTitle()));

      it("should return the correct result", () => {
        expect(result).toBe(expected);
      });
    });
  };

  const checkValueMethodsWithParentPresent = () => {
    describe("when the node's value is half of the total", () => {
      beforeEach(() => {
        getNode().value = 50;
        getParentNode().value = 100;
      });

      checkGetDrawerPercentage({ expected: "50.00" });
      checkGetDrawerEntityListPercentage({ expected: "50" });
    });

    describe("when the node's value is less than a percent", () => {
      beforeEach(() => {
        getNode().value = 0.9;
        getParentNode().value = 100;
      });

      checkGetDrawerPercentage({ expected: "0.90" });
      checkGetDrawerEntityListPercentage({ expected: ">1" });
    });

    describe("when the node's value rounds to zero", () => {
      beforeEach(() => {
        getNode().value = 0.000001;
        getParentNode().value = 100;
      });

      checkGetDrawerPercentage({ expected: "0.00" });
      checkGetDrawerEntityListPercentage({ expected: ">1" });
    });
  };

  const checkValueMethodsWithOutParentPresent = () => {
    describe("when the node's value is the total", () => {
      beforeEach(() => {
        getNode().value = 100;
      });

      checkGetDrawerPercentage({ expected: "100" });
      checkGetDrawerEntityListPercentage({ expected: "100" });
    });
  };

  describe("when the node has a parent", () => {
    beforeEach(() => {
      createProps({
        name: "mockIntermediary",
        data: {
          name: "mockIntermediary",
          entity: "albums",
        },
        parent: {
          data: { name: "mockRoot", entity: "root" },
        },
      });
    });

    describe("when the node has known children", () => {
      beforeEach(() => {
        mockNode.children = [
          { data: { name: "mockChild", entity: "albums" } } as d3Node,
        ];
        arrange();
      });

      checkInstance();
      checkGetDrawerTitle({ expected: "mockIntermediary" });
      checkGetDrawerListTitle({
        expected: `capitalize(${_t(sunburstTranslations.entities.albums)}:)`,
      });
      checkGetDrawerSubTitle({ expected: "mockRoot" });
      checkValueMethodsWithParentPresent();
    });

    describe("when the node has unknown children", () => {
      beforeEach(() => {
        mockNode.children = [
          { data: { name: "mockChild", entity: "unknown" } } as d3Node,
        ];
        arrange();
      });

      checkInstance();
      checkGetDrawerTitle({ expected: "mockIntermediary" });
      checkGetDrawerListTitle({ expected: null });
      checkGetDrawerSubTitle({ expected: "mockRoot" });
      checkValueMethodsWithParentPresent();
    });
  });

  describe("when the node does not have a parent", () => {
    beforeEach(() => {
      createProps({
        name: "mockRoot",
        data: {
          name: "mockRoot",
          entity: "root",
        },
      });
    });

    describe("when the node has known children", () => {
      beforeEach(() => {
        mockNode.children = [
          { data: { name: "mockChild", entity: "albums" } } as d3Node,
        ];
        arrange();
      });

      checkInstance();
      checkGetDrawerTitle({ expected: "mockRoot" });
      checkGetDrawerListTitle({
        expected: `capitalize(${_t(sunburstTranslations.entities.albums)}:)`,
      });
      checkGetDrawerSubTitle({ expected: null });
      checkValueMethodsWithOutParentPresent();
    });

    describe("when the node has unknown children", () => {
      beforeEach(() => {
        mockNode.children = [
          { data: { name: "mockChild", entity: "unknown" } } as d3Node,
        ];
        arrange();
      });

      checkInstance();
      checkGetDrawerTitle({ expected: "mockRoot" });
      checkGetDrawerListTitle({ expected: null });
      checkGetDrawerSubTitle({ expected: null });
      checkValueMethodsWithOutParentPresent();
    });
  });
});
