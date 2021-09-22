import { render, screen } from "@testing-library/react";
import translation from "../../../../../public/locales/en/navbar.json";
import routes from "../../../../config/routes";
import SimpleLink from "../../../link/link.component";
import NavBarAvatar from "../../navbar.avatar/navbar.avatar.component";
import NavBarLogo from "../navbar.logo.component";

jest.mock("../../navbar.avatar/navbar.avatar.component", () => {
  return jest.fn().mockImplementation(() => <div>MockComponent</div>);
});

jest.mock("../../../link/link.component", () => {
  return jest.fn().mockImplementation(() => <>{TitlePlaceHolder}</>);
});

const TitlePlaceHolder = "TitlePlaceHolder";

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

  it("should render the title SimpleLink with the correct props", () => {
    expect(SimpleLink).toBeCalledTimes(1);
    const call = (SimpleLink as jest.Mock).mock.calls[0][0];
    expect(call.href).toBe(routes.home);
    expect(call.children).toBe(translation.title);
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
