import { render, waitFor, cleanup } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import settings from "../../../../../config/lastfm";
import mockNavBarHook from "../../../../../hooks/tests/navbar.mock";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import mockRouter from "../../../../../tests/fixtures/mock.router";
import SearchContainer from "../search.container.component";
import SearchForm from "../search.form.component";
import type { LastFMTop20SearchFormInterface } from "../../../../../types/forms/lastfm/search";
import type { FormikHelpers } from "formik";

jest.mock("../search.form.component", () => {
  return jest.fn().mockImplementation(() => <div>MockSearchForm</div>);
});

jest.mock("../../../../../hooks/navbar", () => {
  return jest.fn().mockImplementation(() => mockNavBarHook);
});

describe("SearchContainer", () => {
  let validateUserName: (username: string) => string | undefined;
  let handleSubmit: (
    values: LastFMTop20SearchFormInterface,
    actions: FormikHelpers<LastFMTop20SearchFormInterface>
  ) => void;
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
    beforeEach(() => {
      arrange();
      expect(SearchForm).toBeCalledTimes(1);
      handleSubmit = (SearchForm as jest.Mock).mock.calls[0][0].handleSubmit;
    });

    const mockAction = {
      setSubmitting: jest.fn(),
    } as never as FormikHelpers<LastFMTop20SearchFormInterface>;
    const mockFormContent = { username: "validUsername" };

    describe("when called with a username", () => {
      beforeEach(() => handleSubmit(mockFormContent, mockAction));

      it("should call setSubmitting as expected", () => {
        expect(mockAction.setSubmitting).toBeCalledTimes(1);
        expect(mockAction.setSubmitting).toBeCalledWith(true);
      });
    });
  });
});
