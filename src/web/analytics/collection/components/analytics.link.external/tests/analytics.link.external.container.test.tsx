import { render } from "@testing-library/react";
import AnalyticsExternalLinkWrapper from "../analytics.link.external.component";
import AnalyticsExternalLinkWrapperContainer from "../analytics.link.external.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock("../analytics.link.external.component", () =>
  require("@fixtures/react/parent").createComponent(
    "AnalyticsExternalLinkWrapper"
  )
);

describe("AnalyticsExternalLinkWrapperContainer", () => {
  const buttonText = "Click Me";
  const mockLink = "https://example.com";

  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <AnalyticsExternalLinkWrapperContainer href={mockLink}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsExternalLinkWrapperContainer>
    );
  };

  it("should render the AnalyticsGenericWrapper as expected", () => {
    expect(AnalyticsExternalLinkWrapper).toBeCalledTimes(1);
    checkMockCall(AnalyticsExternalLinkWrapper, {}, 0, ["clickHandler"]);
  });
});
