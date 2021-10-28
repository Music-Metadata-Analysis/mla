import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import MockPopupDialogue, { testIDs } from "./fixtures/mock.popup.dialogue";
import mockUserInterfaceHook from "../../../../hooks/tests/ui.mock.hook";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import Popup from "../popup.component";

jest.mock("../../../../hooks/ui", () => ({
  __esModule: true,
  default: () => mockUserInterfaceHook,
}));

describe("PopUp", () => {
  const mockName = "FeedBack";
  const mockMessage = "mockMessage";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <Popup
        name={mockName}
        message={mockMessage}
        Component={MockPopupDialogue}
      />
    );
  };

  describe("when the popup has it's state set to open", () => {
    beforeEach(() => {
      mockUserInterfaceHook.popups.status.mockImplementation(() => true);
      arrange();
    });

    it("should only open once", () => {
      expect(MockPopupDialogue).toBeCalledTimes(1);
      checkMockCall(
        MockPopupDialogue,
        {
          message: mockMessage,
        },
        0,
        ["onClose"]
      );
    });

    it("should display the mock component", async () => {
      expect(
        await screen.findByTestId(testIDs.MockPopUpComponent)
      ).toBeTruthy();
    });

    describe("when unmounted", () => {
      beforeEach(() => {
        mockUserInterfaceHook.popups.close.mockClear();
        cleanup();
      });

      it("should set the status to closed", async () => {
        expect(mockUserInterfaceHook.popups.close).toBeCalledTimes(1);
        expect(mockUserInterfaceHook.popups.close).toBeCalledWith(mockName);
      });
    });

    describe("when closed", () => {
      beforeEach(async () => {
        mockUserInterfaceHook.popups.close.mockClear();
        const component = await screen.findByText(mockMessage);
        fireEvent.click(component);
      });

      it("should NOT display the mock component", async () => {
        await waitFor(() =>
          expect(screen.queryByTestId(testIDs.MockPopUpComponent)).toBeNull()
        );
      });

      it("should set the status to closed", async () => {
        expect(mockUserInterfaceHook.popups.close).toBeCalledTimes(1);
        expect(mockUserInterfaceHook.popups.close).toBeCalledWith(mockName);
      });

      describe("when unmounted", () => {
        beforeEach(() => {
          mockUserInterfaceHook.popups.close.mockClear();
          cleanup();
        });

        it("should NOT set the status again", async () => {
          expect(mockUserInterfaceHook.popups.close).toBeCalledTimes(0);
        });
      });
    });
  });

  describe("when the popup has it's state set to closed", () => {
    beforeEach(() => {
      mockUserInterfaceHook.popups.status.mockImplementation(() => false);
      arrange();
    });

    it("should NOT open again", () => {
      expect(MockPopupDialogue).toBeCalledTimes(0);
    });
  });
});
