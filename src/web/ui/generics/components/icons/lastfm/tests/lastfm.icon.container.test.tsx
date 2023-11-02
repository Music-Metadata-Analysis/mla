import { render } from "@testing-library/react";
import LastFMIcon from "../lastfm.icon.component";
import LastFMIconContainer from "../lastfm.icon.container";
import mainTranslations from "@locales/main.json";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("../lastfm.icon.component", () =>
  require("@fixtures/react/child").createComponent("LastFMIcon")
);

describe("LastFMIconContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<LastFMIconContainer />);
  };

  describe("LastFMIcon", () => {
    describe("when rendered ", () => {
      beforeEach(() => {
        arrange();
      });

      it("should render the LastFMIcon component with the correct props", () => {
        expect(LastFMIcon).toHaveBeenCalledTimes(1);
        checkMockCall(
          LastFMIcon,
          {
            altText: _t(mainTranslations.altText.lastfm),
          },
          0
        );
      });
    });
  });
});
