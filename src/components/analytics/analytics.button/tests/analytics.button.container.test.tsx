import { render } from "@testing-library/react";
import AnalyticsButtonWrapper from "../analytics.button.component";
import AnalyticsButtonWrapperContainer from "../analytics.button.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@src/hooks/analytics.hook");

jest.mock("../analytics.button.component", () =>
  require("@fixtures/react/parent").createComponent("AnalyticsButtonWrapper")
);

describe("AnalyticsButtonWrapperContainer", () => {
  const buttonText = "Click Me";
  const mockButtonName = "test button";

  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <AnalyticsButtonWrapperContainer buttonName={mockButtonName}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsButtonWrapperContainer>
    );
  };

  it("should render the AnalyticsButtonWrapper as expected", () => {
    expect(AnalyticsButtonWrapper).toBeCalledTimes(1);
    checkMockCall(AnalyticsButtonWrapper, {}, 0, ["clickHandler"]);
  });
});
