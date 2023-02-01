import MockCompleteReport1 from "./states/state.data.set.1.json";
import MockCompleteReport2 from "./states/state.data.set.2.json";
import MockCompleteReport3 from "./states/state.data.set.3.json";
import MockCompleteReport4 from "./states/state.data.set.4.json";
import MockCompleteReport5 from "./states/state.data.set.5.json";
import SunBurstStateToChartDataTranslator from "../translator.class";
import LastFMTranslations from "@locales/lastfm.json";
import MockSunburstData4 from "@src/web/reports/generics/components/charts/sunburst/svg/tests/data/sunburst.data.set.4.json";
import MockSunburstData5 from "@src/web/reports/generics/components/charts/sunburst/svg/tests/data/sunburst.data.set.5.json";
import { MockReportClass } from "@src/web/reports/lastfm/generics/components/report.class/tests/implementations/concrete.sunburst.report.class";
import type { SunBurstData } from "@src/web/reports/generics/types/charts/sunburst.types";
import type { LastFMAggregateReportContentType } from "@src/web/reports/lastfm/generics/types/state/aggregate.report.types";

describe("SunBurstStateToChartDataTranslator", () => {
  let instance: SunBurstStateToChartDataTranslator;
  let mockRootEntity: SunBurstData;
  const mockTopLevelEntity = "artists" as const;

  describe("When instantiated", () => {
    beforeEach(() => {
      mockRootEntity = {
        name: "Top Artists",
        entity: "root" as const,
        value: 184368,
        children: [],
      };
      const report = new MockReportClass();
      instance = new SunBurstStateToChartDataTranslator(
        report.entityKeys,
        LastFMTranslations.playCountByArtist.remainderTag
      );
    });

    const arrange = (
      sourceData: {
        name: string;
        playcount: number;
        albums: unknown[];
        fetched: boolean;
      }[]
    ) => {
      return instance.convert(
        mockRootEntity,
        sourceData as unknown as LastFMAggregateReportContentType[],
        mockTopLevelEntity
      );
    };

    describe("convert", () => {
      let result: unknown;

      describe("when given a finished report with a no artist listens", () => {
        beforeEach(() => {
          result = arrange([
            {
              name: "Lights & Motion",
              playcount: 0,
              albums: [],
              fetched: true,
            },
          ]);
        });

        it("should return the correct data", () => {
          expect(result).toStrictEqual({
            entity: "root",
            name: "Top Artists",
            children: [
              {
                entity: "artists",
                name: "Unidentified",
                value: 184368,
              },
            ],
          });
        });
      });

      describe("when given a finished report with a single artist and no albums", () => {
        beforeEach(() => {
          result = arrange(
            MockCompleteReport1.data.report.playCountByArtist.content
          );
        });

        it("should return the correct data", () => {
          expect(result).toStrictEqual({
            entity: "root",
            name: "Top Artists",
            children: [
              {
                entity: "artists",
                name: "Lights & Motion",
                children: [
                  {
                    entity: "albums",
                    name: "Unidentified",
                    value: 5709,
                  },
                ],
              },
              {
                entity: "artists",
                name: "Unidentified",
                value: 178659,
              },
            ],
          });
        });
      });

      describe("when given a finished report with a single artist, a single album and no tracks", () => {
        beforeEach(() => {
          result = arrange(
            MockCompleteReport2.data.report.playCountByArtist.content
          );
        });

        it("should return the correct data", () => {
          expect(result).toStrictEqual({
            entity: "root",
            name: "Top Artists",
            children: [
              {
                entity: "artists",
                name: "Lights & Motion",
                children: [
                  {
                    children: [],
                    entity: "albums",
                    name: "Chronicle",
                    value: 889,
                  },
                  {
                    entity: "albums",
                    name: "Unidentified",
                    value: 4820,
                  },
                ],
              },
              {
                entity: "artists",
                name: "Unidentified",
                value: 178659,
              },
            ],
          });
        });
      });

      describe("when given a finished report with a single artist, a single album and all tracks", () => {
        beforeEach(() => {
          result = arrange(
            MockCompleteReport3.data.report.playCountByArtist.content
          );
        });

        it("should return the correct data", () => {
          expect(result).toStrictEqual({
            entity: "root",
            name: "Top Artists",
            children: [
              {
                entity: "artists",
                name: "Lights & Motion",
                children: [
                  {
                    entity: "albums",
                    name: "Chronicle",
                    value: 889,
                    children: [
                      {
                        entity: "tracks",
                        name: "Fireflies",
                      },
                      {
                        entity: "tracks",
                        name: "Glow",
                      },
                      {
                        entity: "tracks",
                        name: "Antlers",
                      },
                      {
                        entity: "tracks",
                        name: "Reborn",
                      },
                      {
                        entity: "tracks",
                        name: "Northern Lights",
                      },
                      {
                        entity: "tracks",
                        name: "Particle Storm",
                      },
                      {
                        entity: "tracks",
                        name: "As the World Goes Away",
                      },
                      {
                        entity: "tracks",
                        name: "Paper Wings",
                      },
                      {
                        entity: "tracks",
                        name: "The Spectacular Quiet",
                      },
                    ],
                  },
                  {
                    entity: "albums",
                    name: "Unidentified",
                    value: 4820,
                  },
                ],
              },
              {
                entity: "artists",
                name: "Unidentified",
                value: 178659,
              },
            ],
          });
        });
      });

      describe("when given a finished report, with multiple artists, albums and tracks", () => {
        beforeEach(() => {
          result = arrange(
            MockCompleteReport4.data.report.playCountByArtist.content
          );
        });

        it("should return the correct data", () => {
          expect(result).toStrictEqual(MockSunburstData4);
        });
      });

      describe("when given a finished finished report, with the top20 artists, albums and tracks", () => {
        beforeEach(() => {
          result = arrange(
            MockCompleteReport5.data.report.playCountByArtist.content
          );
        });

        it("should return the correct data", () => {
          expect(result).toStrictEqual(MockSunburstData5);
        });
      });
    });
  });
});
