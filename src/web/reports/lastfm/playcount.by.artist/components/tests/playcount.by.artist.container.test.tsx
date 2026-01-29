import { render } from "@testing-library/react";
import PlayCountByArtistContainer from "../playcount.by.artist.container";
import {
  getMockComponentProp,
  getMockComponentPropCount,
} from "@src/fixtures/mocks/mock.component.props";
import SunBurstContainer from "@src/web/reports/lastfm/generics/components/report.component/sunburst/sunburst.report.container";
import mockUserHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import PlayCountByArtistQuery from "@src/web/reports/lastfm/playcount.by.artist/state/queries/playcount.by.artist.report.class";
import type { PlayCountByArtistContainerProps } from "../playcount.by.artist.container";
import type { reportHookAsLastFMPlayCountByArtistReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";

jest.mock(
  "@src/web/reports/lastfm/generics/components/report.component/sunburst/sunburst.report.container",
  () => require("@fixtures/react/parent").createComponent("SunBurstContainer")
);

describe("PlayCountByArtistContainer", () => {
  let currentProps: PlayCountByArtistContainerProps;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createProps = () =>
    (currentProps = {
      userName: "test-user",
      lastfm: mockUserHook as reportHookAsLastFMPlayCountByArtistReport,
    });

  const arrange = () => {
    createProps();
    render(<PlayCountByArtistContainer {...currentProps} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the SunBurstContainer with the correct props", () => {
      expect(SunBurstContainer).toHaveBeenCalledTimes(1);
      expect(getMockComponentPropCount({ component: SunBurstContainer })).toBe(
        3
      );
      expect(
        getMockComponentProp({
          component: SunBurstContainer,
          propName: "lastfm",
        })
      ).toBe(currentProps.lastfm);
      expect(
        getMockComponentProp({
          component: SunBurstContainer,
          propName: "userName",
        })
      ).toBe(currentProps.userName);
      expect(
        getMockComponentProp({
          component: SunBurstContainer,
          propName: "queryClass",
        })
      ).toBe(PlayCountByArtistQuery);
    });
  });
});
