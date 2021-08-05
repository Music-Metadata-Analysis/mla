import { render, screen } from "@testing-library/react";
import FallBackIcon from "../navbar.fallback.icon.component";

describe("Icons", () => {
  const altText = "LastFM";

  const arrange = () => {
    render(<FallBackIcon />);
  };

  describe("FallBackIcon", () => {
    beforeEach(() => arrange());

    it("should have the correct styles", async () => {
      const img = await screen.findByAltText(altText);
      expect(img).toHaveStyleRule("border-radius", "50%");
    });
  });
});
