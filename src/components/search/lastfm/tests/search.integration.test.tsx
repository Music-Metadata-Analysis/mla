import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import lastfmTranslations from "../../../../../public/locales/en/lastfm.json";
import mainTranslations from "../../../../../public/locales/en/main.json";
import settings from "../../../../config/lastfm";
import routes from "../../../../config/routes";
import mockRouter from "../../../../tests/fixtures/mock.router";
import tLookup from "../../../../tests/fixtures/mock.translation";
import SearchUI from "../search.ui.component";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => mockRouter,
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn().mockReturnValue({ data: {}, status: "authenticated" }),
}));

jest.mock(
  "../../../../components/authentication/authentication.container",
  () => jest.fn(() => <div>MockedAuthenticationComponent</div>)
);

describe("SearchTopTracks", () => {
  let enteredUsername: string;
  const mockT = jest.fn((key) => tLookup(key, lastfmTranslations));
  const mockTitle = "mockTitle";

  beforeEach(() => {
    jest.clearAllMocks();
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

  it("should display the correct field label", async () => {
    expect(
      await screen.findByText(lastfmTranslations.search.fieldLabel)
    ).toBeTruthy();
  });

  it("should display the correct input placeholder", async () => {
    expect(
      await screen.findByPlaceholderText(
        lastfmTranslations.search.fieldPlaceholder
      )
    ).toBeTruthy();
  });

  it("should display the correct buttonText", async () => {
    expect(
      await screen.findByText(lastfmTranslations.search.buttonText)
    ).toBeTruthy();
  });

  it("should render the last.fm avatar correctly", async () => {
    expect(
      await screen.findByAltText(mainTranslations.altText.lastfm)
    ).toBeTruthy();
  });

  describe("given no username", () => {
    beforeEach(async () => {
      const element = screen.getByPlaceholderText(
        lastfmTranslations.search.fieldPlaceholder
      ) as HTMLInputElement;
      expect(element.value).toBe("");
    });

    describe("when search is pressed", () => {
      beforeEach(async () => {
        const element = screen.getByText(lastfmTranslations.search.buttonText);
        await waitFor(() => fireEvent.click(element));
      });

      it("should show an error message", async () => {
        expect(
          await screen.findByText(
            lastfmTranslations.search.errors.username.required
          )
        ).toBeTruthy();
      });
    });
  });

  describe("given an invalid username", () => {
    beforeEach(async () => {
      const element = screen.getByPlaceholderText(
        lastfmTranslations.search.fieldPlaceholder
      ) as HTMLInputElement;
      expect(element.value).toBe("");
      enteredUsername = "a".repeat(settings.search.maxUserLength + 1);
      await waitFor(() =>
        fireEvent.change(element, { target: { value: enteredUsername } })
      );
    });

    describe("when search is pressed", () => {
      beforeEach(async () => {
        const element = screen.getByText(lastfmTranslations.search.buttonText);
        await waitFor(() => fireEvent.click(element));
      });

      it("should show an error message", async () => {
        expect(
          await screen.findByText(
            lastfmTranslations.search.errors.username.valid
          )
        ).toBeTruthy();
      });
    });
  });

  describe("given a valid username", () => {
    beforeEach(async () => {
      enteredUsername = 'niall-byrne"urlencoded"';
      const element = screen.getByPlaceholderText(
        lastfmTranslations.search.fieldPlaceholder
      );
      await waitFor(() =>
        fireEvent.change(element, { target: { value: enteredUsername } })
      );
    });

    describe("when search is pressed", () => {
      beforeEach(async () => {
        const element = screen.getByText(lastfmTranslations.search.buttonText);
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
