import { render } from "@testing-library/react";
import AnalyticsInternalLinkWrapper from "../analytics.link.internal.component";
import AnalyticsInternalLinkWrapperContainer from "../analytics.link.internal.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@src/hooks/analytics.hook");

jest.mock("../analytics.link.internal.component", () =>
  require("@fixtures/react/parent").createComponent(
    "AnalyticsInternalLinkWrapper"
  )
);

describe("AnalyticsInternalLinkWrapperContainer", () => {
  const buttonText = "Click Me";
  const mockLink = "https://example.com";

  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <AnalyticsInternalLinkWrapperContainer href={mockLink}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsInternalLinkWrapperContainer>
    );
  };

  it("should render the AnalyticsGenericWrapper as expected", () => {
    expect(AnalyticsInternalLinkWrapper).toBeCalledTimes(1);
    checkMockCall(AnalyticsInternalLinkWrapper, {}, 0, ["clickHandler"]);
  });
});
