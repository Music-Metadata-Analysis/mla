import mockReportState from "./fixtures/state.data.set.1.json";
import LastFMReportPlayCountByArtistStateEncapsulation from "../../encapsulations/lastfm.report.encapsulation.playcount.by.artist.class";
import PlayCountByArtistQuery from "../playcount.by.artist.report.class";
import routes from "@src/config/routes";
import SunBurstDrawerContainer from "@src/web/reports/lastfm/generics/components/drawer/sunburst/sunburst.report.drawer.container";
import SunBurstBaseQuery from "@src/web/reports/lastfm/generics/state/queries/sunburst.query.base.class";
import PlayCountByArtistNodeEncapsulation from "@src/web/reports/lastfm/playcount.by.artist/state/charts/sunburst/playcount.by.artist.node.class";
import type { d3Node } from "@src/web/reports/generics/types/charts/sunburst.types";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/lastfm.aggregate.report.types";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";
import type { PlayCountByArtistReportInterface } from "@src/web/reports/lastfm/playcount.by.artist/types/state/aggregate.report.types";

describe(PlayCountByArtistQuery.name, () => {
  let instance: PlayCountByArtistQuery;

  const arrange = () => (instance = new PlayCountByArtistQuery());

  const mockNode = { name: "mockNode" } as unknown as d3Node;

  const mockReportProperties = {
    error: null,
    inProgress: false,
    profileUrl: null,
    ready: true,
    userName: "mockUserName",
    retries: 3,
    data: {
      report: {
        playCountByArtist: {
          status: {
            complete: false,
            steps_total: 100,
            steps_complete: 1,
          },
          created: "today",
          content: [],
        },
        image: [],
        playcount: 0,
      },
      integration: "LASTFM" as const,
    },
  };

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should be a descendent of SunBurstBaseReport", () => {
      expect(instance).toBeInstanceOf(SunBurstBaseQuery);
    });

    it("should have the expected properties", () => {
      expect(instance.getDrawerComponent()).toBe(SunBurstDrawerContainer);
      expect(instance.getAnalyticsReportType()).toBe("PLAYCOUNT BY ARTIST");
      expect(
        instance.getEncapsulatedReportState(mockReportProperties)
      ).toBeInstanceOf(LastFMReportPlayCountByArtistStateEncapsulation);
      expect(instance.getEncapsulatedNode(mockNode)).toBeInstanceOf(
        PlayCountByArtistNodeEncapsulation
      );
      expect(instance.getReportTranslationKey()).toBe("playCountByArtist");
      expect(instance.getRetryRoute()).toBe(
        routes.search.lastfm.playCountByArtist
      );
      expect(instance.getHookMethod()).toBe("playCountByArtist");
      expect(instance.getEntities()).toStrictEqual([
        "artists",
        "albums",
        "tracks",
      ]);
    });

    describe("getReportData", () => {
      let result: LastFMAggregateReportResponseInterface<
        PlayCountByArtistReportInterface[]
      >;

      beforeEach(
        () =>
          (result = instance.getReportData(
            mockReportState as LastFMReportStateBase
          ))
      );

      it("should return the correct result", () => {
        expect(result).toBe(mockReportState.data.report.playCountByArtist);
      });
    });
  });
});
