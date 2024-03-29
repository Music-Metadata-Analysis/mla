import { fireEvent, render, screen } from "@testing-library/react";
import SpotifyAuthButton, {
  SpotifyAuthButtonError,
} from "../auth.button.spotify";
import type { AuthButtonVendorComponentInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

describe("SpotifyAuthButton", () => {
  const buttonWidth = 245;
  const mockCallBack = jest.fn();
  const mockText = "Button Text";
  const mockIconText = "Mock Icon";
  let consoleSpy: jest.SpyInstance;
  let iconComponent: AuthButtonVendorComponentInterface["iconComponent"];

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => null);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  const arrange = () => {
    render(
      <SpotifyAuthButton
        callBack={mockCallBack}
        iconComponent={iconComponent}
        text={mockText}
        width={buttonWidth}
      />
    );
  };

  describe("when rendered WITHOUT an iconComponent", () => {
    beforeEach(() => {
      iconComponent = undefined;
    });

    it("should throw SpotifyAuthButtonError", () => {
      const test = () => arrange();
      expect(test).toThrow(SpotifyAuthButtonError);
    });
  });

  describe("when rendered WITH an iconComponent", () => {
    beforeEach(() => {
      iconComponent = jest.fn(() => <div>{mockIconText}</div>);
    });

    it("should NOT throw SpotifyAuthButtonError", () => {
      const test = () => arrange();
      expect(test).not.toThrow(SpotifyAuthButtonError);
    });

    it("should render the underlying iconComponent", () => {
      arrange();

      expect(iconComponent).toHaveBeenCalledTimes(1);
      expect(iconComponent).toHaveBeenCalledWith();
    });

    it("should have the correct width", async () => {
      arrange();

      const button = await screen.findByText(mockIconText);
      expect(
        button.parentElement?.parentElement?.parentElement?.style.width
      ).toBe(`${buttonWidth}px`);
    });

    it("should display the correct text", async () => {
      arrange();

      expect(await screen.findByText(mockText)).toBeTruthy();
    });

    describe("when clicked", () => {
      beforeEach(async () => {
        arrange();
        fireEvent.click(await screen.findByText(mockIconText));
      });

      it("should call the callBack as expected", () => {
        expect(mockCallBack).toHaveBeenCalledTimes(1);
        expect(mockCallBack).toHaveBeenCalledWith("spotify");
      });
    });
  });
});
