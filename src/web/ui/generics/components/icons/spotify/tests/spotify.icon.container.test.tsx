import { render } from "@testing-library/react";
import SpotifyIcon from "../spotify.icon.component";
import SpotifyIconContainer, {
  SpotifyIconContainerProps,
} from "../spotify.icon.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("../spotify.icon.component", () =>
  require("@fixtures/react/child").createComponent("SpotifyIcon")
);

describe("SpotifyIconContainerProps", () => {
  let currentProps: SpotifyIconContainerProps;

  const baseProps: SpotifyIconContainerProps = {
    width: 50,
    height: 50,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<SpotifyIconContainer {...currentProps} />);
  };

  const resetProps = () => (currentProps = { ...baseProps });

  describe("when rendered with defaults", () => {
    beforeEach(() => {
      delete currentProps.height;
      delete currentProps.width;

      arrange();
    });

    it("should render the SpotifyIcon component with the correct props", () => {
      expect(SpotifyIcon).toBeCalledTimes(1);
      checkMockCall(
        SpotifyIcon,
        {
          height: 26,
          width: 26,
        },
        0
      );
    });
  });

  describe("when rendered with configured values", () => {
    beforeEach(() => {
      currentProps.height = 100;
      currentProps.width = 150;

      arrange();
    });

    it("should render the SpotifyIcon component with the correct props", () => {
      expect(SpotifyIcon).toBeCalledTimes(1);
      checkMockCall(
        SpotifyIcon,
        {
          height: currentProps.height,
          width: currentProps.width,
        },
        0
      );
    });
  });
});
