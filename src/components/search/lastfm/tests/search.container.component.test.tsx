import { render, waitFor, cleanup } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import settings from "../../../../config/lastfm";
import mockNavBarHook from "../../../../hooks/tests/navbar.mock.hook";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import mockRouter from "../../../../tests/fixtures/mock.router";
import SearchContainer from "../search.container.component";
import SearchForm from "../search.form.component";
import type { LastFMUserSearchInterface } from "../../../../types/search/lastfm/search";
import type { FormikHelpers } from "formik";

jest.mock("../search.form.component", () => {
  return jest.fn().mockImplementation(() => <div>MockSearchForm</div>);
});

jest.mock("../../../../hooks/navbar", () => {
  return jest.fn().mockImplementation(() => mockNavBarHook);
});

jest.mock("next-auth/client", () => ({
  useSession: () => mockUseSession(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

const mockUseSession = jest.fn().mockReturnValue([{}, true]);

describe("SearchContainer", () => {
  let validateUserName: (username: string) => string | undefined;
  let handleSubmit: (
    values: LastFMUserSearchInterface,
    actions: FormikHelpers<LastFMUserSearchInterface>
  ) => void;
  const mockRoute = "/a/very/fancy/route/to/something";
  const mockOpenError = jest.fn();
  const mockCloseError = jest.fn();
  const mockT = jest.fn((arg: string) => `t(${arg})`);

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
    expect(mockNavBarHook.hideNavBar).toBeCalledTimes(1);
  });

  it("should attempt to hide the NavBar during a screen resize", () => {
    arrange();
    expect(mockNavBarHook.hideNavBar).toBeCalledTimes(1);
    global.dispatchEvent(new Event("resize"));
    expect(mockNavBarHook.hideNavBar).toBeCalledTimes(2);
  });

  it("should show the NavBar during cleanup", async () => {
    arrange();
    cleanup();
    await waitFor(() => expect(mockNavBarHook.showNavBar).toBeCalledTimes(1));
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
        expect(returnValue).toBe("t(search.errors.username.required)");
        expect(mockT).toBeCalledWith("search.errors.username.required");
      });

      it("should generate an error", () => {
        expect(mockOpenError).toBeCalledTimes(1);
        expect(mockOpenError).toBeCalledWith(
          "username",
          "t(search.errors.username.required)"
        );
        expect(mockT).toBeCalledWith("search.errors.username.required");
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
        expect(returnValue).toBe("t(search.errors.username.valid)");
        expect(mockT).toBeCalledWith("search.errors.username.valid");
      });

      it("should generate an error", () => {
        expect(mockOpenError).toBeCalledTimes(1);
        expect(mockOpenError).toBeCalledWith(
          "username",
          "t(search.errors.username.valid)"
        );
        expect(mockT).toBeCalledWith("search.errors.username.valid");
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
        mockUseSession.mockReturnValue([{ user: true }, true]);
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
        mockUseSession.mockReturnValue([null, false]);
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
            "t(search.errors.session.notLoggedIn)"
          );
          expect(mockT).toBeCalledWith("search.errors.session.notLoggedIn");
        });

        it("should NOT redirect to the expected route", () => {
          expect(mockRouter.push).toBeCalledTimes(0);
        });
      });
    });
  });
});
