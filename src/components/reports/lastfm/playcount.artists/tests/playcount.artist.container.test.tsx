import { render } from "@testing-library/react";
import SunBurstContainer from "../../common/sunburst.report/sunburst.report.container";
import PlayCountByArtistContainer, {
  PlayCountByArtistContainerProps,
} from "../playcount.artists.container";
import PlayCountByArtistReport from "../playcount.artists.report.class";
import mockUserHook from "@src/hooks/tests/lastfm.mock.hook";
import {
  getMockComponentProp,
  getMockComponentPropCount,
} from "@src/tests/fixtures/mock.component.props";
import type { userHookAsLastFMPlayCountByArtistReport } from "@src/types/user/hook.types";

jest.mock("../../common/sunburst.report/sunburst.report.container", () =>
  createMockedComponent("SunBurstContainer")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("PlayCountByArtistContainer", () => {
  let currentProps: PlayCountByArtistContainerProps;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createProps = () =>
    (currentProps = {
      userName: "test-user",
      user: mockUserHook as userHookAsLastFMPlayCountByArtistReport,
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
        getMockComponentProp({ component: SunBurstContainer, propName: "user" })
      ).toBe(currentProps.user);
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
