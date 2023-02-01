import mockUserState from "./states/state.data.set.1.json";
import PlayCountByArtistNode from "../playcount.artists.node.class";
import PlayCountByArtistReport from "../playcount.artists.report.class";
import routes from "@src/config/routes";
import PlayCountByArtistState from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import SunBurstDrawerContainer from "@src/web/reports/lastfm/generics/components/drawer/sunburst/sunburst.report.drawer.container";
import SunBurstBaseReport from "@src/web/reports/lastfm/generics/components/report.class/sunburst.report.base.class";
import type { LastFMUserStateBase } from "@src/types/user/state.types";
import type { d3Node } from "@src/web/reports/generics/types/charts/sunburst.types";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/web/reports/lastfm/playcount.artists/types/state/aggregate.report.types";

describe(PlayCountByArtistReport.name, () => {
  let instance: PlayCountByArtistReport;

  const arrange = () => (instance = new PlayCountByArtistReport());

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
      expect(instance).toBeInstanceOf(SunBurstBaseReport);
    });

    it("should have the expected properties", () => {
      expect(instance.getDrawerComponent()).toBe(SunBurstDrawerContainer);
      expect(instance.getAnalyticsReportType()).toBe("PLAYCOUNT BY ARTIST");
      expect(
        instance.getEncapsulatedReportState(mockReportProperties)
      ).toBeInstanceOf(PlayCountByArtistState);
      expect(instance.getEncapsulatedNode(mockNode)).toBeInstanceOf(
        PlayCountByArtistNode
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
            mockUserState as LastFMUserStateBase
          ))
      );

      it("should return the correct result", () => {
        expect(result).toBe(mockUserState.data.report.playCountByArtist);
      });
    });
  });
});
