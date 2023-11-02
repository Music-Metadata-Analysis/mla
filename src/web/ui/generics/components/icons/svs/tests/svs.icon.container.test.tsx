import { render } from "@testing-library/react";
import SVSIcon from "../svs.icon.component";
import SVSIconContainer from "../svs.icon.container";
import mainTranslations from "@locales/main.json";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("../svs.icon.component", () =>
  require("@fixtures/react/child").createComponent("SVSIcon")
);

describe("SVSIconContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<SVSIconContainer />);
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should render the SVSIcon component with the correct props", () => {
      expect(SVSIcon).toHaveBeenCalledTimes(1);
      checkMockCall(
        SVSIcon,
        {
          altText: _t(mainTranslations.altText.svs),
        },
        0
      );
    });
  });
});
