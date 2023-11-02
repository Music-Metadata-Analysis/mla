import { render, screen } from "@testing-library/react";
import SpotifyButton from "../spotify.icon.component";

describe("SpotifyIcon", () => {
  const arrange = () => {
    render(<SpotifyButton />);
  };

  describe("with a specified size", () => {
    let svg: SVGElement;

    beforeEach(async () => {
      arrange();
      svg = (await screen.findByText("Spotify Login Icon"))
        .parentElement as unknown as SVGElement;
    });

    it("should render svg with correct role", () => {
      expect(svg.getAttribute("role")).toBe("img");
    });

    it("should render svg with correct title", () => {
      expect(svg.firstChild?.textContent).toBe("Spotify Login Icon");
    });
  });
});
