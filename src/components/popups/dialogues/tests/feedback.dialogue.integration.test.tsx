import { fireEvent, render, screen } from "@testing-library/react";
import FeedbackDialogue, { testIDs } from "../feedback.dialogue";
import externalLinks from "@src/config/external";
import { mockUseLocale } from "@src/hooks/tests/locale.mock.hook";

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

describe("FeedbackDialogue", () => {
  const mockClose = jest.fn();
  const mockMessage = "mockMessage";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<FeedbackDialogue message={mockMessage} onClose={mockClose} />);
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

    it("should nolonger show the expected text", async () => {
      expect(mockClose).toBeCalledTimes(1);
    });
  });
});
