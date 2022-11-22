import { render, screen, fireEvent } from "@testing-library/react";
import AnalyticsGenericWrapper from "../analytics.generic.component";

describe("AnalyticsEventWrapper", () => {
  const buttonText = "Click Me";

  const mockAnalyticsClick = jest.fn();
  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <AnalyticsGenericWrapper clickHandler={mockAnalyticsClick}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsGenericWrapper>
    );
  };

  it("should render test button as expected", async () => {
    expect(await screen.findByText(buttonText)).toBeTruthy();
  });

  describe("when the test button is clicked", () => {
    beforeEach(async () => {
      const link = await screen.findByText(buttonText);
      expect(link).not.toBeNull();
      fireEvent.click(link as HTMLElement);
    });

    it("should call the button click handler", () => {
      expect(mockClick).toBeCalledTimes(1);
    });

    it("should call the button tracker", () => {
      expect(mockAnalyticsClick).toBeCalledTimes(1);
    });
  });
});
