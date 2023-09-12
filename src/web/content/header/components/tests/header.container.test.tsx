import { render } from "@testing-library/react";
import Header from "../header.component";
import HeaderContainer from "../header.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/vendors/integrations/web.framework/vendor");

jest.mock("../header.component.tsx", () =>
  require("@fixtures/react/child").createComponent("Header")
);

describe("HeaderContainer", () => {
  const testTranslationKey = "default";

  const mockMainT = new MockUseTranslation("main").t;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useTranslation).mockReturnValueOnce({ t: mockMainT });
  });

  const arrange = () => {
    return render(<HeaderContainer pageKey={testTranslationKey} />);
  };

  const checkHeaderComponentProps = () => {
    it("should call the Header component with the correct props", () => {
      expect(Header).toBeCalledTimes(1);
      checkMockCall(
        Header,
        {
          descriptionText: mockMainT(`pages.${testTranslationKey}.description`),
          titleText: mockMainT(`pages.${testTranslationKey}.title`),
        },
        0
      );
    });
  };

  describe("when given a test pageKey", () => {
    beforeEach(() => {
      arrange();
    });

    checkHeaderComponentProps();
  });
});
