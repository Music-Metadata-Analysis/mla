import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SearchContainer from "../search.container";
import lastfmTranslations from "@locales/lastfm.json";
import mainTranslations from "@locales/main.json";
import settings from "@src/config/lastfm";
import routes from "@src/config/routes";
import mockAuthHook, {
  mockUserProfile,
} from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock(
  "@src/web/authentication/sign.in/components/authentication.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "MockedAuthenticationComponent"
    )
);

describe("SearchTopTracks", () => {
  let enteredUsername: string;
  const mockTitle = "mockTitle";

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthHook.status = "authenticated";
    mockAuthHook.user = mockUserProfile;
    arrange();
  });

  const arrange = () => {
    render(
      <SearchContainer
        titleText={mockTitle}
        route={routes.reports.lastfm.top20tracks}
      />
    );
  };

  it("should display the correct title", async () => {
    expect(await screen.findByText(mockTitle)).toBeTruthy();
  });

  it("should display the correct input placeholder", async () => {
    expect(
      await screen.findByPlaceholderText(
        _t(lastfmTranslations.search.fieldPlaceholder)
      )
    ).toBeTruthy();
  });

  it("should display the correct buttonText", async () => {
    expect(
      await screen.findByText(_t(lastfmTranslations.search.buttonText))
    ).toBeTruthy();
  });

  it("should render the last.fm avatar correctly", async () => {
    expect(
      await screen.findByAltText(_t(mainTranslations.altText.lastfm))
    ).toBeTruthy();
  });

  describe("given no username", () => {
    beforeEach(async () => {
      const element = screen.getByPlaceholderText(
        _t(lastfmTranslations.search.fieldPlaceholder)
      ) as HTMLInputElement;
      expect(element.value).toBe("");
    });

    describe("when search is pressed", () => {
      beforeEach(async () => {
        const element = screen.getByText(
          _t(lastfmTranslations.search.buttonText)
        );
        await waitFor(() => fireEvent.click(element));
      });

      it("should show an error message", async () => {
        expect(
          await screen.findByText(
            _t(lastfmTranslations.search.errors.username.required)
          )
        ).toBeTruthy();
      });
    });
  });

  describe("given an invalid username", () => {
    beforeEach(async () => {
      const element = screen.getByPlaceholderText(
        _t(lastfmTranslations.search.fieldPlaceholder)
      ) as HTMLInputElement;
      expect(element.value).toBe("");
      enteredUsername = "a".repeat(settings.search.maxUserLength + 1);
      await waitFor(() =>
        fireEvent.change(element, { target: { value: enteredUsername } })
      );
    });

    describe("when search is pressed", () => {
      beforeEach(async () => {
        const element = screen.getByText(
          _t(lastfmTranslations.search.buttonText)
        );
        await waitFor(() => fireEvent.click(element));
      });

      it("should show an error message", async () => {
        expect(
          await screen.findByText(
            _t(lastfmTranslations.search.errors.username.valid)
          )
        ).toBeTruthy();
      });
    });
  });

  describe("given a valid username", () => {
    beforeEach(async () => {
      enteredUsername = 'niall-byrne"urlencoded"';
      const element = screen.getByPlaceholderText(
        _t(lastfmTranslations.search.fieldPlaceholder)
      );
      await waitFor(() =>
        fireEvent.change(element, { target: { value: enteredUsername } })
      );
    });

    describe("when search is pressed", () => {
      beforeEach(async () => {
        const element = screen.getByText(
          _t(lastfmTranslations.search.buttonText)
        );
        await waitFor(() => fireEvent.click(element));
      });

      it("should redirect to the expected page", () => {
        const params = {
          username: enteredUsername,
        };
        const query = new URLSearchParams(params);
        expect(mockRouterHook.push).toBeCalledTimes(1);
        expect(mockRouterHook.push).toBeCalledWith(
          `${routes.reports.lastfm.top20tracks}?${query.toString()}`
        );
      });
    });
  });
});
