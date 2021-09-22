import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import StyledButton from "../../../../button/button.standard/button.standard.component";
import SearchForm from "../search.form.component";

jest.mock(
  "../../../../button/button.standard/button.standard.component",
  () => {
    const Original = jest.requireActual(
      "../../../../button/button.standard/button.standard.component"
    ).default;
    return jest.fn((props) => <Original {...props} />);
  }
);

describe("SearchForm", () => {
  beforeEach(() => jest.clearAllMocks());

  const mockT = jest.fn((arg: string) => `t(${arg})`);
  const mockValidate = jest.fn();
  const mockSubmit = jest.fn();

  const arrange = () => {
    render(
      <SearchForm
        t={mockT}
        validateUserName={mockValidate}
        handleSubmit={mockSubmit}
      />
    );
  };

  it("should display the correct username field label", async () => {
    arrange();
    expect(await screen.findByText("t(search.fieldLabel)")).toBeTruthy();
  });

  it("should display the correct username placeholder text", async () => {
    arrange();
    const inputField = await screen.findByPlaceholderText(
      "t(search.fieldPlaceholder)"
    );
    expect(inputField).toHaveFocus();
  });

  it("should display the correct button text", async () => {
    arrange();
    expect(await screen.findByText("t(search.buttonText)")).toBeTruthy();
  });

  it("should call StyledInput once", async () => {
    arrange();
    const inputField = (await screen.findByPlaceholderText(
      "t(search.fieldPlaceholder)"
    )) as HTMLInputElement & { ref: string };
    expect(inputField.id).toBe("username");
    expect(inputField.placeholder).toBe("t(search.fieldPlaceholder)");
  });

  it("should call Button with the correct props", async () => {
    arrange();
    expect(StyledButton).toBeCalledTimes(1);
    checkMockCall(StyledButton, {
      analyticsName: "Search: last.fm",
      isLoading: false,
      mb: 2,
      mt: 4,
      type: "submit",
    });
  });

  describe("when text is entered", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockValidate.mockImplementation(() => undefined);
      arrange();
      const input = await screen.findByPlaceholderText(
        "t(search.fieldPlaceholder)"
      );
      await waitFor(() => {
        fireEvent.change(input, { target: { value: "valid_user_name" } });
      });
    });

    describe("when submit is pressed", () => {
      let button: HTMLElement;

      beforeEach(async () => {
        button = await screen.findByText("t(search.buttonText)");
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
