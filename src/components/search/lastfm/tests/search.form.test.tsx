import { Flex } from "@chakra-ui/react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchForm from "../search.form";
import lastfmTranslations from "@locales/lastfm.json";
import StyledButton from "@src/components/button/button.standard/button.standard.component";
import { MockUseLocale, _t } from "@src/hooks/__mocks__/locale.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/router");

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Flex"]);
});

jest.mock(
  "@src/components/button/button.standard/button.standard.component",
  () =>
    jest.fn((props) =>
      jest
        .requireActual(
          "@src/components/button/button.standard/button.standard.component"
        )
        .default(props)
    )
);

describe("SearchForm", () => {
  beforeEach(() => jest.clearAllMocks());

  const mockT = new MockUseLocale("lastfm");
  const mockValidate = jest.fn();
  const mockSubmit = jest.fn();

  const arrange = () => {
    render(
      <SearchForm
        t={mockT.t}
        validateUserName={mockValidate}
        handleSubmit={mockSubmit}
      />
    );
  };

  it("should call Flex as expected to center content", () => {
    arrange();
    expect(Flex).toBeCalledTimes(2);
    checkMockCall(Flex, {
      flexDirection: "column",
      justify: "center",
    });
  });

  it("should display the correct username placeholder text", async () => {
    arrange();
    expect(
      await screen.findByPlaceholderText(
        _t(lastfmTranslations.search.fieldPlaceholder)
      )
    ).toBeTruthy();
  });

  it("should display the correct button text", async () => {
    arrange();
    expect(
      await screen.findByText(_t(lastfmTranslations.search.buttonText))
    ).toBeTruthy();
  });

  it("should call StyledInput once", async () => {
    arrange();
    const inputField = (await screen.findByPlaceholderText(
      _t(lastfmTranslations.search.fieldPlaceholder)
    )) as HTMLInputElement & { ref: string };
    expect(inputField.id).toBe("username");
    expect(inputField.placeholder).toBe(
      _t(lastfmTranslations.search.fieldPlaceholder)
    );
  });

  it("should call Button with the correct props", async () => {
    arrange();
    expect(StyledButton).toBeCalledTimes(1);
    checkMockCall(StyledButton, {
      analyticsName: "Search: last.fm",
      isLoading: false,
      ml: 3,
      mt: 2,
      type: "submit",
      width: ["50px", "100px", "100px"],
    });
  });

  describe("when text is entered", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockValidate.mockImplementation(() => undefined);
      arrange();
      const input = await screen.findByPlaceholderText(
        _t(lastfmTranslations.search.fieldPlaceholder)
      );
      await waitFor(() => {
        fireEvent.change(input, { target: { value: "valid_user_name" } });
      });
    });

    describe("when submit is pressed", () => {
      let button: HTMLElement;

      beforeEach(async () => {
        button = await screen.findByText(
          _t(lastfmTranslations.search.buttonText)
        );
        await waitFor(() => {
          fireEvent.focus(button);
          fireEvent.click(button);
        });
      });

      it("should call the handleSubmit function as expected", () => {
        expect(mockValidate).toBeCalledTimes(2);
        expect(mockSubmit).toBeCalledTimes(1);
      });
    });
  });
});
