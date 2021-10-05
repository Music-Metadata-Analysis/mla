import { render, screen } from "@testing-library/react";
import translation from "../../../../../public/locales/en/navbar.json";
import routes from "../../../../config/routes";
import mockAnalyticsHook from "../../../../hooks/tests/analytics.mock";
import mockRouter from "../../../../tests/fixtures/mock.router";
import NavBarAvatar from "../../navbar.avatar/navbar.avatar.component";
import NavBarLink from "../../navbar.link/navbar.link.component";
import NavBarLogo from "../navbar.logo.component";

jest.mock("../../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

jest.mock("../../navbar.avatar/navbar.avatar.component", () => {
  return jest.fn().mockImplementation(() => <div>MockComponent</div>);
});

jest.mock("../../navbar.link/navbar.link.component", () => {
  return jest.fn().mockImplementation(() => <>{TitlePlaceHolder}</>);
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => mockRouter,
}));

const TitlePlaceHolder = "TitlePlaceHolder";

describe("NavBarLogo", () => {
  const mockHref = "https://google.ca";
  const mockImage = "https://imagesite.com/image.jpeg";

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.pathname = routes.home;
    arrange();
  });

  const arrange = () => {
    render(<NavBarLogo href={mockHref} image={mockImage} />);
  };

  it("should display the app title", async () => {
    expect(await screen.findByText(TitlePlaceHolder)).toBeTruthy();
  });

  it("should render the title SimpleLink with the correct props", () => {
    expect(NavBarLink).toBeCalledTimes(1);
    const call = (NavBarLink as jest.Mock).mock.calls[0][0];
    expect(call.selected).toBe(routes.home === mockRouter.pathname);
    expect(call.href).toBe(routes.home);
    expect(call.children).toBe(translation.title);
    expect(call.trackButtonClick).toBe(mockAnalyticsHook.trackButtonClick);
    expect(Object.keys(call).length).toBe(4);
  });

  it("should render the Avatar with the correct props", () => {
    expect(NavBarAvatar).toBeCalledTimes(1);
    const call = (NavBarAvatar as jest.Mock).mock.calls[0][0];
    expect(call.image).toBe(mockImage);
    expect(call.href).toBe(mockHref);
    expect(Object.keys(call).length).toBe(2);
  });
});
