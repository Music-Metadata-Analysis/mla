import { render } from "@testing-library/react";
import PlayCountByArtistContainer, {
  PlayCountByArtistContainerProps,
} from "../playcount.artists.container";
import PlayCountByArtistReport from "../playcount.artists.report.class";
import {
  getMockComponentProp,
  getMockComponentPropCount,
} from "@src/fixtures/mocks/mock.component.props";
import mockUserHook from "@src/hooks/__mocks__/lastfm.hook.mock";
import SunBurstContainer from "@src/web/reports/lastfm/generics/components/report.component/sunburst/sunburst.report.container";
import type { userHookAsLastFMPlayCountByArtistReport } from "@src/types/user/hook.types";

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
      lastfm: mockUserHook as userHookAsLastFMPlayCountByArtistReport,
    });

  const arrange = () => {
    createProps();
    render(<PlayCountByArtistContainer {...currentProps} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the SunBurstContainer with the correct props", () => {
      expect(SunBurstContainer).toBeCalledTimes(1);
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
          propName: "reportClass",
        })
      ).toBe(PlayCountByArtistReport);
    });
  });
});
