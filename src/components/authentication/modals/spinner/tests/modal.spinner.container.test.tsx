import { render } from "@testing-library/react";
import AuthenticationSpinnerModal from "../modal.spinner.component";
import AuthenticationSpinnerModalContainer from "../modal.spinner.container";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/locale");

jest.mock("../modal.spinner.component", () =>
  require("@fixtures/react/child").createComponent("AuthenticationSpinnerModal")
);

describe("AuthenticationSpinnerModalContainer", () => {
  const mockT = new MockUseLocale("authentication").t;

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<AuthenticationSpinnerModalContainer onClose={mockOnClose} />);
  };

  it("should render the AuthenticationSpinnerModal as expected", () => {
    expect(AuthenticationSpinnerModal).toBeCalledTimes(1);
    checkMockCall(
      AuthenticationSpinnerModal,
      {
        onClose: mockOnClose,
        titleText: mockT("spinnerTitle"),
      },
      0
    );
  });
});