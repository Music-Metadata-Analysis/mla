import { render } from "@testing-library/react";
import PlayCountByArtistContainer, {
  PlayCountByArtistContainerProps,
} from "../playcount.artists.container";
import PlayCountByArtistReport from "../playcount.artists.report.class";
import SunBurstContainer from "@src/components/reports/lastfm/common/report.component/sunburst/sunburst.report.container";
import mockUserHook from "@src/hooks/__mocks__/lastfm.mock";
import {
  getMockComponentProp,
  getMockComponentPropCount,
} from "@src/tests/fixtures/mock.component.props";
import type { userHookAsLastFMPlayCountByArtistReport } from "@src/types/user/hook.types";

jest.mock(
  "@src/components/reports/lastfm/common/report.component/sunburst/sunburst.report.container",
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
