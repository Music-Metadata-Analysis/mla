import { render } from "@testing-library/react";
import BaseButton from "../../button.base/button.base.component";
import StyledButtonLink from "../button.external.link.component";
import ClickLink from "@src/components/clickable/click.link.external/click.link.external.component";

jest.mock(
  "@src/components/clickable/click.link.external/click.link.external.component",
  () => createMockedComponent("ClickLink")
);

jest.mock("../../button.base/button.base.component", () =>
  createMockedComponent("BaseButton")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("ButtonLink", () => {
  const linkText = "Link";
  const mockHref = "mockTestName";
  const mockColour = "mockColour";
  const mockClickHandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <StyledButtonLink
        onClick={mockClickHandler}
        bg={mockColour}
        href={mockHref}
      >
        {linkText}
      </StyledButtonLink>
    );
  };

  it("should render ClickLink as expected", () => {
    expect(ClickLink).toBeCalledTimes(1);
    const call = (ClickLink as jest.Mock).mock.calls[0];
    expect(call[0].href).toBe(mockHref);
    expect(call[0].children).toBeDefined();
    expect(Object.keys(call[0]).length).toBe(2);
  });

  it("should render BaseButton as expected", () => {
    expect(BaseButton).toBeCalledTimes(1);
    const call = (BaseButton as jest.Mock).mock.calls[0];
    expect(call[0].bg).toBe(mockColour);
    expect(call[0].children).toBeDefined();
    expect(call[0].onClick).toBe(mockClickHandler);
    expect(Object.keys(call[0]).length).toBe(3);
  });
});
