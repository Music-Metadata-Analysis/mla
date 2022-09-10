import type { SunBurstAggregateReportContent } from "../../../../../../types/clients/api/lastfm/sunburst.types";
import type { SunBurstData } from "../../../../../../types/reports/sunburst.types";

class SunBurstDataTranslator {
  entityKeys: Array<SunBurstData["entity"]>;
  valueKey = "playcount" as const;

  constructor(entityKeys: Array<SunBurstData["entity"]>) {
    this.entityKeys = entityKeys;
  }

  convert(
    sunBurstData: SunBurstData,
    stateContent: SunBurstAggregateReportContent[],
    entityType: SunBurstData["entity"]
  ) {
    let totalCount = 0;
    const childEntityType = this.getChildEntity(stateContent);

    stateContent.forEach((state) => {
      totalCount += state[this.valueKey];
      this.createNode(sunBurstData, state, entityType, childEntityType);
    });
    this.createRemainderNode(sunBurstData, entityType, totalCount);
    if (childEntityType !== "unknown") {
      delete sunBurstData.value;
    }
    return sunBurstData;
  }

  private getChildEntity(stateContent: SunBurstAggregateReportContent[]) {
    if (stateContent.length > 0) {
      const contentEntryKeys = Object.keys(stateContent[0]);
      const match = this.entityKeys.find((entity) => {
        return contentEntryKeys.includes(entity);
      });
      if (match) return match;
    }
    return "unknown";
  }

  private createNode = (
    sunBurstData: SunBurstData,
    state: SunBurstAggregateReportContent,
    entityType: SunBurstData["entity"],
    childEntityType: SunBurstData["entity"]
  ) => {
    if (state[this.valueKey] > 0 || this.isLeafNode(entityType)) {
      const node = {
        entity: entityType,
        name: state.name,
      } as SunBurstData;
      if (state[this.valueKey]) node.value = state[this.valueKey];
      sunBurstData.children?.push(node);
      const children = state[
        childEntityType
      ] as SunBurstAggregateReportContent[];
      if (children) {
        node["children"] = [];
        this.convert(node, children, childEntityType);
      }
    }
  };

  private createRemainderNode(
    sunBurstData: SunBurstData,
    entityType: SunBurstData["entity"],
    totalCount: number
  ) {
    if (Array.isArray(sunBurstData.children) && !this.isLeafNode(entityType)) {
      const sunBurstChildren = sunBurstData.children as SunBurstData[];
      const remainder = this.getValue(sunBurstData) - totalCount;
      if (remainder > 0) {
        sunBurstChildren?.push({
          entity: entityType,
          name: "Other", // Needs to be translated
          value: remainder,
        });
      }
    }
  }

  private isLeafNode(entity: SunBurstData["entity"]) {
    return entity === this.entityKeys[this.entityKeys.length - 1];
  }

  private getValue(sunBurstData: SunBurstData) {
    return Number(sunBurstData.value);
  }
}

export default SunBurstDataTranslator;
