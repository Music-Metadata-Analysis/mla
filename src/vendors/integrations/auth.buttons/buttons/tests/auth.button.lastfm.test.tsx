import { fireEvent, render, screen } from "@testing-library/react";
import LastFMAuthButton, { LastFMAuthButtonError } from "../auth.button.lastfm";
import type { AuthButtonVendorComponentInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

describe("LastFMAuthButton", () => {
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
      <LastFMAuthButton
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

    it("should throw LastFMAuthButtonError", () => {
      const test = () => arrange();
      expect(test).toThrow(LastFMAuthButtonError);
    });
  });

  describe("when rendered WITH an iconComponent", () => {
    beforeEach(() => {
      iconComponent = jest.fn(() => <div>{mockIconText}</div>);
    });

    it("should NOT throw LastFMAuthButtonError", () => {
      const test = () => arrange();
      expect(test).not.toThrow(LastFMAuthButtonError);
    });

    it("should render the underlying iconComponent", () => {
      arrange();

      expect(iconComponent).toBeCalledTimes(1);
      expect(iconComponent).toBeCalledWith({
        height: undefined,
        width: undefined,
      });
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
        expect(mockCallBack).toBeCalledTimes(1);
        expect(mockCallBack).toBeCalledWith("lastfm");
      });
    });
  });
});
