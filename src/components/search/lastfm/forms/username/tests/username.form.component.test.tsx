import { Flex } from "@chakra-ui/react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserNameForm from "../username.form.component";
import { ids } from "../username.form.identifiers";
import StyledButton from "@src/components/button/button.standard/button.standard.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Flex"])
);

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

describe("UserNameForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidate.mockImplementation(() => undefined);

    arrange();
  });

  const mockPlaceHolderText = "mockPlaceHolderText";
  const mockSubmitButtonText = "mockSubmitButtonText";

  const mockValidate = jest.fn();
  const mockSubmit = jest.fn();

  const arrange = () => {
    render(
      <UserNameForm
        handleSubmit={mockSubmit}
        validateUserName={mockValidate}
        placeHolderText={mockPlaceHolderText}
        submitButtonText={mockSubmitButtonText}
      />
    );
  };

  it("should render the chakra Flex component with the correct props", () => {
    expect(Flex).toBeCalledTimes(2);
    checkMockCall(Flex, {
      flexDirection: "column",
      justify: "center",
    });
  });

  it("should display the correct username placeholder text", async () => {
    expect(
      await screen.findByPlaceholderText(mockPlaceHolderText)
    ).toBeTruthy();
  });

  it("should display the correct button text", async () => {
    expect(await screen.findByText(mockSubmitButtonText)).toBeTruthy();
  });

  it("should render the input field as expected", async () => {
    const inputField = (await screen.findByPlaceholderText(
      mockPlaceHolderText
    )) as HTMLInputElement;

    expect(inputField.id).toBe(ids.username);
    expect(inputField.placeholder).toBe(mockPlaceHolderText);
  });

  it("should render the StyledButton component with the correct props", async () => {
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
      const input = await screen.findByPlaceholderText(mockPlaceHolderText);

      await waitFor(() => {
        fireEvent.change(input, { target: { value: "valid_user_name" } });
      });
    });

    describe("when submit is pressed", () => {
      let button: HTMLElement;

      beforeEach(async () => {
        button = await screen.findByText(mockSubmitButtonText);

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
