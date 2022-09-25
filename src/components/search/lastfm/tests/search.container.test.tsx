import { render, waitFor, cleanup } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import SearchContainer from "../search.container";
import SearchForm from "../search.form";
import lastfmTranslations from "@locales/lastfm.json";
import settings from "@src/config/lastfm";
import mockAuthHook, { mockUserProfile } from "@src/hooks/tests/auth.mock.hook";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";
import mockNavBarHook from "@src/hooks/tests/navbar.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import mockRouter from "@src/tests/fixtures/mock.router";
import type { LastFMUserSearchInterface } from "@src/types/search/lastfm/search";
import type { FormikHelpers } from "formik";

jest.mock("../search.form", () => {
  return jest
    .fn()
    .mockImplementation(() => <div id="username">MockSearchForm</div>);
});

jest.mock("@src/hooks/auth", () => () => mockAuthHook);

jest.mock("@src/hooks/navbar", () => {
  return jest.fn().mockImplementation(() => mockNavBarHook);
});

describe("SearchContainer", () => {
  let validateUserName: (username: string) => string | undefined;
  let handleSubmit: (
    values: LastFMUserSearchInterface,
    actions: FormikHelpers<LastFMUserSearchInterface>
  ) => void;
  const mockRoute = "/a/very/fancy/route/to/something";
  const mockOpenError = jest.fn();
  const mockCloseError = jest.fn();
  const mockT = new mockUseLocale("lastfm").t;

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <SearchContainer
          closeError={mockCloseError}
          openError={mockOpenError}
          route={mockRoute}
          t={mockT}
        />
      </RouterContext.Provider>
    );
  };

  it("should attempt to hide the NavBar during render", () => {
    arrange();
    expect(mockNavBarHook.setters.hideNavBar).toBeCalledTimes(1);
  });

  it("should attempt to hide the NavBar during a screen resize", () => {
    arrange();
    expect(mockNavBarHook.setters.hideNavBar).toBeCalledTimes(1);
    global.dispatchEvent(new Event("resize"));
    expect(mockNavBarHook.setters.hideNavBar).toBeCalledTimes(2);
  });

  it("should show the NavBar during cleanup", async () => {
    arrange();
    cleanup();
    await waitFor(() =>
      expect(mockNavBarHook.setters.showNavBar).toBeCalledTimes(1)
    );
  });

  it("should render the SearchForm with the correct props", () => {
    arrange();
    expect(SearchForm).toBeCalledTimes(1);
    checkMockCall(SearchForm, {}, 0, ["t", "handleSubmit", "validateUserName"]);
  });

  describe("validateName", () => {
    let returnValue: string | undefined;

    beforeEach(() => jest.clearAllMocks());

    beforeEach(() => {
      arrange();
      expect(SearchForm).toBeCalledTimes(1);
      validateUserName = (SearchForm as jest.Mock).mock.calls[0][0]
        .validateUserName;
    });

    describe("when called on a non-existing username (minimum length is 1)", () => {
      beforeEach(() => (returnValue = validateUserName("")));

      it("should return the correct value", () => {
        expect(returnValue).toBe(
          _t(lastfmTranslations.search.errors.username.required)
        );
      });

      it("should generate an error", () => {
        expect(mockOpenError).toBeCalledTimes(1);
        expect(mockOpenError).toBeCalledWith(
          "username",
          _t(lastfmTranslations.search.errors.username.required)
        );
      });
    });

    describe("when called on username that's too long", () => {
      beforeEach(
        () =>
          (returnValue = validateUserName(
            "1".repeat(settings.search.maxUserLength + 1)
          ))
      );

      it("should return the correct value", () => {
        expect(returnValue).toBe(
          _t(lastfmTranslations.search.errors.username.valid)
        );
      });

      it("should generate an error", () => {
        expect(mockOpenError).toBeCalledTimes(1);
        expect(mockOpenError).toBeCalledWith(
          "username",
          _t(lastfmTranslations.search.errors.username.valid)
        );
      });
    });

    describe("when called on a valid username", () => {
      beforeEach(() => (returnValue = validateUserName("niall-byrne")));

      it("should return the correct value", () => {
        expect(returnValue).toBe(undefined);
      });

      it("should NOT generate an error", () => {
        expect(mockOpenError).toBeCalledTimes(0);
      });

      it("should close existing errors", () => {
        expect(mockCloseError).toBeCalledTimes(1);
        expect(mockCloseError).toBeCalledWith("username");
      });
    });
  });

  describe("handleSubmit", () => {
    const arrangeHandleSubmit = () => {
      arrange();
      expect(SearchForm).toBeCalledTimes(1);
      handleSubmit = (SearchForm as jest.Mock).mock.calls[0][0].handleSubmit;
    };

    const mockAction = {
      setSubmitting: jest.fn(),
    } as never as FormikHelpers<LastFMUserSearchInterface>;
    const mockFormContent = { username: "validUsername" };

    describe("when the user is logged in", () => {
      beforeEach(() => {
        mockAuthHook.status = "authenticated";
        mockAuthHook.user = mockUserProfile;
        arrangeHandleSubmit();
      });

      describe("when submitted with a username", () => {
        beforeEach(() => handleSubmit(mockFormContent, mockAction));

        it("should NOT call setSubmitting as expected", () => {
          expect(mockAction.setSubmitting).toBeCalledTimes(0);
        });

        it("should redirect to the expected route", () => {
          const query = new URLSearchParams(mockFormContent);
          expect(mockRouter.push).toBeCalledTimes(1);
          expect(mockRouter.push).toBeCalledWith(
            `${mockRoute}?${query.toString()}`
          );
        });
      });
    });

    describe("when the user is not logged in", () => {
      beforeEach(() => {
        mockAuthHook.status = "unauthenticated";
        mockAuthHook.user = null;
        arrangeHandleSubmit();
      });

      describe("when submitted with a username", () => {
        beforeEach(() => handleSubmit(mockFormContent, mockAction));

        it("should call setSubmitting as expected", () => {
          expect(mockAction.setSubmitting).toBeCalledTimes(1);
          expect(mockAction.setSubmitting).toBeCalledWith(false);
        });

        it("should generate an error", () => {
          expect(mockOpenError).toBeCalledTimes(1);
          expect(mockOpenError).toBeCalledWith(
            "session",
            _t(lastfmTranslations.search.errors.session.notLoggedIn)
          );
        });

        it("should NOT redirect to the expected route", () => {
          expect(mockRouter.push).toBeCalledTimes(0);
        });
      });
    });
  });
});
