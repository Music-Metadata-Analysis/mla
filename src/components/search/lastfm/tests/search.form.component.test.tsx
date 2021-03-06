import { Flex } from "@chakra-ui/react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import StyledButton from "../../../button/button.standard/button.standard.component";
import SearchForm from "../search.form.component";

jest.mock("../../../button/button.standard/button.standard.component", () => {
  const Original = jest.requireActual(
    "../../../button/button.standard/button.standard.component"
  ).default;
  return jest.fn((props) => <Original {...props} />);
});

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Flex"]);
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

  it("should call Flex as expected to center content", () => {
    arrange();
    expect(Flex).toBeCalledTimes(1);
    checkMockCall(Flex, { justify: "center", maxWidth: "700px" });
  });

  it("should display the correct username field label", async () => {
    arrange();
    expect(await screen.findByText("t(search.fieldLabel)")).toBeTruthy();
  });

  it("should display the correct username placeholder text", async () => {
    arrange();
    expect(
      await screen.findByPlaceholderText("t(search.fieldPlaceholder)")
    ).toBeTruthy();
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
      width: ["50px", "100px", "100px"],
      analyticsName: "Search: last.fm",
      isLoading: false,
      mb: 12,
      mt: 8,
      ml: 3,
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
