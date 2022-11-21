import { render, waitFor, cleanup } from "@testing-library/react";
import SearchContainer from "../search.container";
import SearchForm from "../search.form";
import lastfmTranslations from "@locales/lastfm.json";
import settings from "@src/config/lastfm";
import mockAuthHook, { mockUserProfile } from "@src/hooks/__mocks__/auth.mock";
import { MockUseLocale, _t } from "@src/hooks/__mocks__/locale.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";
import mockNavBarControllerHook from "@src/hooks/controllers/__mocks__/navbar.controller.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { LastFMUserSearchInterface } from "@src/types/search/lastfm/search";
import type { FormikHelpers } from "formik";

jest.mock("@src/hooks/auth");

jest.mock("@src/hooks/controllers/navbar.controller.hook");

jest.mock("@src/hooks/router");

jest.mock("../search.form", () =>
  require("@fixtures/react/child").createComponent(
    "MockSearchForm",
    "default",
    { id: "username" }
  )
);

describe("SearchContainer", () => {
  let validateUserName: (username: string) => string | undefined;
  let handleSubmit: (
    values: LastFMUserSearchInterface,
    actions: FormikHelpers<LastFMUserSearchInterface>
  ) => void;
  const mockRoute = "/a/very/fancy/route/to/something";
  const mockOpenError = jest.fn();
  const mockCloseError = jest.fn();
  const mockT = new MockUseLocale("lastfm").t;

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <SearchContainer
        closeError={mockCloseError}
        openError={mockOpenError}
        route={mockRoute}
        t={mockT}
      />
    );
  };

  it("should attempt to hide the NavBar during render", () => {
    arrange();
    expect(mockNavBarControllerHook.navigation.setFalse).toBeCalledTimes(1);
  });

  it("should attempt to hide the NavBar during a screen resize", () => {
    arrange();
    expect(mockNavBarControllerHook.navigation.setFalse).toBeCalledTimes(1);
    global.dispatchEvent(new Event("resize"));
    expect(mockNavBarControllerHook.navigation.setFalse).toBeCalledTimes(2);
  });

  it("should show the NavBar during cleanup", async () => {
    arrange();
    cleanup();
    await waitFor(() =>
      expect(mockNavBarControllerHook.navigation.setTrue).toBeCalledTimes(1)
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
      validateUserName =
        jest.mocked(SearchForm).mock.calls[0][0].validateUserName;
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
      handleSubmit = jest.mocked(SearchForm).mock.calls[0][0].handleSubmit;
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
          expect(mockRouterHook.push).toBeCalledTimes(1);
          expect(mockRouterHook.push).toBeCalledWith(
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
          expect(mockRouterHook.push).toBeCalledTimes(0);
        });
      });
    });
  });
});
