import { render } from "@testing-library/react";
import LastFMIcon from "../lastfm.icon.component";
import LastFMIconContainer, {
  LastFMIconContainerProps,
} from "../lastfm.icon.container";
import mainTranslations from "@locales/main.json";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { _t } from "@src/hooks/__mocks__/locale.hook.mock";

jest.mock("@src/hooks/locale.hook");

jest.mock("../lastfm.icon.component", () =>
  require("@fixtures/react/child").createComponent("LastFMIcon")
);

describe("LastFMIconContainer", () => {
  let currentProps: LastFMIconContainerProps;

  const baseProps: LastFMIconContainerProps = {
    width: 50,
    height: 50,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<LastFMIconContainer {...currentProps} />);
  };

  const resetProps = () => (currentProps = { ...baseProps });

  describe("LastFMIcon", () => {
    describe("when rendered with defaults", () => {
      beforeEach(() => {
        delete currentProps.height;
        delete currentProps.width;

        arrange();
      });

      it("should render the LastFMIcon component with the correct props", () => {
        expect(LastFMIcon).toBeCalledTimes(1);
        checkMockCall(
          LastFMIcon,
          {
            altText: _t(mainTranslations.altText.lastfm),
            height: 50,
            width: 50,
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

      it("should render the LastFMIcon component with the correct props", () => {
        expect(LastFMIcon).toBeCalledTimes(1);
        checkMockCall(
          LastFMIcon,
          {
            altText: _t(mainTranslations.altText.lastfm),
            height: currentProps.height,
            width: currentProps.width,
          },
          0
        );
      });
    });
  });
});
