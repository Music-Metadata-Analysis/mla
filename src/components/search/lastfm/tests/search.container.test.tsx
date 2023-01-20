import { render } from "@testing-library/react";
import Search from "../search.component";
import SearchContainer from "../search.container";
import navbarSettings from "@src/config/navbar";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import useNavBarThresholdToggle from "@src/web/navigation/navbar/state/controllers/navbar.threshold.toggle.hook";

jest.mock(
  "@src/web/navigation/navbar/state/controllers/navbar.threshold.toggle.hook"
);

jest.mock("../search.component", () =>
  require("@fixtures/react/child").createComponent("Search")
);

describe("SearchContainer", () => {
  const mockTitleText = "mockTitleText";
  const mockRoute = "/some/fancy/route/here";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<SearchContainer route={mockRoute} titleText={mockTitleText} />);
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should render the navbar threshold toggle hook with the correct props", () => {
      expect(useNavBarThresholdToggle).toBeCalledTimes(1);
      expect(useNavBarThresholdToggle).toBeCalledWith({
        threshold: navbarSettings.minimumHeightDuringInput,
      });
    });

    it("should render the Search component with the correct props", () => {
      expect(Search).toBeCalledTimes(1);
      checkMockCall(Search, {
        route: mockRoute,
        titleText: mockTitleText,
      });
    });
  });
});
