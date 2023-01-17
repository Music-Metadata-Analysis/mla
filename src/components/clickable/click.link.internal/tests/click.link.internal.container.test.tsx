import { render } from "@testing-library/react";
import ClickInternalLink from "../click.link.internal.component";
import ClickInternalLinkContainer from "../click.link.internal.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@src/hooks/router.hook");

jest.mock("../click.link.internal.component", () =>
  require("@fixtures/react/parent").createComponent("ClickInternalLink")
);

describe("ClickInternalLinkContainer", () => {
  const linkText = "Link";
  const mockPath = "/mock/internal/path";

  beforeEach(() => {
    jest.clearAllMocks();

    arrange();
  });

  const arrange = () => {
    render(
      <ClickInternalLinkContainer path={mockPath}>
        {linkText}
      </ClickInternalLinkContainer>
    );
  };

  it("should render ClickInternalLink Component as expected", () => {
    expect(ClickInternalLink).toBeCalledTimes(1);
    checkMockCall(ClickInternalLink, { path: mockPath }, 0, ["clickHandler"]);
  });
});
