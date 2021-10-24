import { render, screen } from "@testing-library/react";
import SpotifyButton, { Icon } from "../spotify.login";

describe("SpotifyButton", () => {
  const testText = "Testing Text";

  const arrange = (iconSize?: string) => {
    if (iconSize) {
      render(<SpotifyButton iconSize={iconSize} text={testText} />);
    } else {
      render(<SpotifyButton text={testText} />);
    }
  };

  describe("with default size", () => {
    beforeEach(() => arrange("26px"));

    it("should render svg with correct size", async () => {
      const svg = (await screen.findByText("Spotify Login Icon"))
        .parentElement as HTMLElement;
      expect(svg).toStrictEqual(render(<Icon />).container.firstChild);
    });
  });

  describe("with a specified size", () => {
    const size = "50px";

    beforeEach(() => arrange(size));

    it("should render svg with correct size", async () => {
      const svg = (await screen.findByText("Spotify Login Icon"))
        .parentElement as HTMLElement;
      expect(svg).toStrictEqual(
        render(<Icon width={size} height={size} />).container.firstChild
      );
    });
  });

  it("should render button with the correct text", async () => {
    arrange();
    expect(await screen.findByText(testText)).toBeTruthy();
  });
});
