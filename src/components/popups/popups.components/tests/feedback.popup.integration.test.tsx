import { fireEvent, render, screen } from "@testing-library/react";
import FeedbackPopUp from "../feedback.popup.component";
import { testIDs } from "../feedback.popup.identifiers";
import externalLinks from "@src/config/external";

jest.mock("@src/hooks/locale.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

describe("FeedbackPopUp", () => {
  const mockClose = jest.fn();
  const mockMessage = "mockMessage";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<FeedbackPopUp message={mockMessage} onClose={mockClose} />);
  };

  describe("when rendered", () => {
    it("should show the expected text", async () => {
      expect(await screen.findByText(mockMessage)).toBeTruthy();
    });
  });

  describe("when the icon is clicked", () => {
    let link: HTMLLinkElement;

    beforeEach(async () => {
      link = (await screen.findByTestId(testIDs.FeedBackDialogueIcon))
        ?.parentElement?.parentElement?.parentElement as HTMLLinkElement;
    });

    it("should navigate to the expected page", async () => {
      expect(link).toHaveAttribute("href", externalLinks.svsContact);
    });
  });

  describe("when the close button is clicked", () => {
    beforeEach(async () => {
      const button = await screen.findByTestId(
        testIDs.FeedBackDialogueCloseButton
      );
      fireEvent.click(button);
    });

    it("should no longer show the expected text", async () => {
      expect(mockClose).toBeCalledTimes(1);
    });
  });
});
