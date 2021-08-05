import { render, screen } from "@testing-library/react";
import translations from "../../../../config/translations";
import ButtonLink from "../../../button.link/button.link.component";
import NavBarAvatar from "../../navbar.avatar/navbar.avatar.component";
import NavBarLogo from "../navbar.logo.component";

const TitlePlaceHolder = "TitlePlaceHolder";

jest.mock("../../navbar.avatar/navbar.avatar.component", () => {
  return jest.fn().mockImplementation(() => <div>MockComponent</div>);
});
jest.mock("../../../button.link/button.link.component", () => {
  return jest.fn().mockImplementation(() => <>{TitlePlaceHolder}</>);
});

describe("NavBarLogo", () => {
  const mockHref = "https://google.ca";
  const mockImage = "https://imagesite.com/image.jpeg";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<NavBarLogo href={mockHref} image={mockImage} />);
  };

  it("should display the app title", async () => {
    expect(await screen.findByText(TitlePlaceHolder)).toBeTruthy();
  });
  it("should render the title ButtonLink with the correct props", () => {
    expect(ButtonLink).toBeCalledTimes(1);
    const call = (ButtonLink as jest.Mock).mock.calls[0][0];
    expect(call.href).toBe("/");
    expect(call.children).toBe(translations.app.title);
    expect(Object.keys(call).length).toBe(2);
  });
  it("should render the Avatar with the correct props", () => {
    expect(NavBarAvatar).toBeCalledTimes(1);
    const call = (NavBarAvatar as jest.Mock).mock.calls[0][0];
    expect(call.image).toBe(mockImage);
    expect(call.href).toBe(mockHref);
    expect(Object.keys(call).length).toBe(2);
  });
});
