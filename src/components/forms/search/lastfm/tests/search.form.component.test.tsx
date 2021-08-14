import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchForm from "../search.form.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.chakra.react.factory.class");
  const chakraMock = factoryInstance.create(["Button"]);
  return chakraMock;
});

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
  it("should display the correct button button text", async () => {
    arrange();
    expect(await screen.findByText("t(search.buttonText)")).toBeTruthy();
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
