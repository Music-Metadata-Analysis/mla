import type { SunBurstData } from "@src/web/reports/generics/types/charts/sunburst.types";
import type { LastFMAggregateReportContentType } from "@src/web/reports/lastfm/generics/types/state/aggregate.report.types";

class SunBurstStateToChartDataTranslator {
  protected entityKeys: Array<SunBurstData["entity"]>;
  protected remainderKey: string;
  protected valueKey = "playcount" as const;

  constructor(entityKeys: Array<SunBurstData["entity"]>, remainderKey: string) {
    this.entityKeys = entityKeys;
    this.remainderKey = remainderKey;
  }

  convert(
    sunBurstData: SunBurstData,
    stateContent: LastFMAggregateReportContentType[],
    entityType: SunBurstData["entity"]
  ) {
    const childrenEntityType = this.getChildrenEntityType(stateContent);

    let totalCount = 0;

    stateContent.forEach((state) => {
      totalCount += state[this.valueKey];
      this.createChartNode(
        { sunBurstData, state, entityType },
        childrenEntityType
      );
    });

    this.createRemainderChartNode({ sunBurstData, entityType }, totalCount);
    this.removeIdentifiedChartValues({
      sunBurstData,
      childrenEntityType: childrenEntityType,
    });

    return sunBurstData;
  }

  protected getChildrenEntityType(
    stateContent: LastFMAggregateReportContentType[]
  ) {
    let match: SunBurstData["entity"] = "unknown";
    if (stateContent.length > 0) {
      const contentEntryKeys = Object.keys(stateContent[0]);
      match =
        this.entityKeys.find((entity) => {
          return contentEntryKeys.includes(entity);
        }) || "unknown";
    }
    return match;
  }

  protected createChartNode = (
    selection: {
      sunBurstData: SunBurstData;
      state: LastFMAggregateReportContentType;
      entityType: SunBurstData["entity"];
    },
    childrenEntityType: SunBurstData["entity"]
  ) => {
    if (
      selection.state[this.valueKey] > 0 ||
      this.isLeafNode(selection.entityType)
    ) {
      const node: SunBurstData = {
        entity: selection.entityType,
        name: selection.state.name,
      };
      if (selection.state[this.valueKey])
        node.value = selection.state[this.valueKey];
      selection.sunBurstData.children?.push(node);
      const children = selection.state[
        childrenEntityType
      ] as LastFMAggregateReportContentType[];
      if (children) {
        node["children"] = [];
        this.convert(node, children, childrenEntityType);
      }
    }
  };

  protected createRemainderChartNode(
    selection: {
      sunBurstData: SunBurstData;
      entityType: SunBurstData["entity"];
    },
    totalCount: number
  ) {
    if (
      selection.sunBurstData.children &&
      !this.isLeafNode(selection.entityType)
    ) {
      const remainder = this.getValue(selection.sunBurstData) - totalCount;
      if (remainder > 0) {
        selection.sunBurstData.children?.push({
          entity: selection.entityType,
          name: this.remainderKey,
          value: remainder,
        });
        if (selection.sunBurstData.children.length === 1) {
          delete selection.sunBurstData.value;
        }
      }
    }
  }

  protected isLeafNode(entity: SunBurstData["entity"]) {
    return entity === this.entityKeys[this.entityKeys.length - 1];
  }

  protected getValue(sunBurstData: SunBurstData) {
    return Number(sunBurstData.value);
  }

  protected removeIdentifiedChartValues(selection: {
    sunBurstData: SunBurstData;
    childrenEntityType: SunBurstData["entity"];
  }) {
    if (selection.childrenEntityType !== "unknown") {
      delete selection.sunBurstData.value;
    }
  }
}

export default SunBurstStateToChartDataTranslator;
