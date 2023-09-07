import { render, screen } from "@testing-library/react";
import SpotifyButton, {
  SpotifyIconComponentProps,
} from "../spotify.icon.component";

describe("SpotifyIcon", () => {
  const arrange = (props: SpotifyIconComponentProps) => {
    render(<SpotifyButton height={props.height} width={props.width} />);
  };

  describe("with a specified size", () => {
    let svg: SVGElement;
    const size = 50;

    beforeEach(async () => {
      arrange({ width: size, height: size });
      svg = (await screen.findByText("Spotify Login Icon"))
        .parentElement as unknown as SVGElement;
    });

    it("should render svg with correct size", () => {
      expect(svg.getAttribute("height")).toBe(`${size}px`);
      expect(svg.getAttribute("width")).toBe(`${size}px`);
    });

    it("should render svg with correct role", () => {
      expect(svg.getAttribute("role")).toBe("img");
    });

    it("should render svg with correct title", () => {
      expect(svg.firstChild?.textContent).toBe("Spotify Login Icon");
    });
  });
});
