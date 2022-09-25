import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SearchUI from "../search.ui";
import lastfmTranslations from "@locales/lastfm.json";
import mainTranslations from "@locales/main.json";
import settings from "@src/config/lastfm";
import routes from "@src/config/routes";
import mockAuthHook, { mockUserProfile } from "@src/hooks/tests/auth.mock.hook";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";
import mockRouter from "@src/tests/fixtures/mock.router";

jest.mock("@src/hooks/auth", () => () => mockAuthHook);

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("@src/components/authentication/authentication.container", () =>
  jest.fn(() => <div>MockedAuthenticationComponent</div>)
);

describe("SearchTopTracks", () => {
  let enteredUsername: string;
  const mockT = new mockUseLocale("lastfm").t;
  const mockTitle = "mockTitle";

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthHook.status = "authenticated";
    mockAuthHook.user = mockUserProfile;
    arrange();
  });

  const arrange = () => {
    render(
      <SearchUI
        t={mockT}
        title={mockTitle}
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
        expect(mockRouter.push).toBeCalledTimes(1);
        expect(mockRouter.push).toBeCalledWith(
          `${routes.reports.lastfm.top20tracks}?${query.toString()}`
        );
      });
    });
  });
});
