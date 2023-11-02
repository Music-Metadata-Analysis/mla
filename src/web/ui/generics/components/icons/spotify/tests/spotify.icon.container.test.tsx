import { render } from "@testing-library/react";
import SpotifyIcon from "../spotify.icon.component";
import SpotifyIconContainer from "../spotify.icon.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("../spotify.icon.component", () =>
  require("@fixtures/react/child").createComponent("SpotifyIcon")
);

describe("SpotifyIconContainerProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<SpotifyIconContainer />);
  };

  describe("when rendered ", () => {
    beforeEach(() => {
      arrange();
    });

    it("should render the SpotifyIcon component with the correct props", () => {
      expect(SpotifyIcon).toHaveBeenCalledTimes(1);
      checkMockCall(SpotifyIcon, {}, 0);
    });
  });
});
