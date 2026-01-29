import { render, screen } from "@testing-library/react";
import LastFMIcon from "../lastfm.icon.component";
import defaultImage from "@JestConfig/modules/images";
import type { LastFMIconProps } from "../lastfm.icon.component";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/vendors/integrations/web.framework/vendor");

describe("LastFMIcon", () => {
  let currentProps: LastFMIconProps;

  const baseProps: LastFMIconProps = {
    altText: "mockAltText",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<LastFMIcon {...currentProps} />);
  };

  const resetProps = () => (currentProps = { ...baseProps });

  const checkAltText = () => {
    it("should render the icon with the correct alternate text", async () => {
      await screen.findByAltText(currentProps.altText);
    });
  };

  const checkImageSource = () => {
    it("should render the icon with the correct image source", async () => {
      const img = await screen.findByAltText(currentProps.altText);
      // Default Image Provided By Jest Object Mapper
      expect(img).toHaveAttribute("src", defaultImage);
    });
  };

  const checkStyle = () => {
    it("should render the icon with the correct styles", async () => {
      const img = await screen.findByAltText(currentProps.altText);
      expect(img).toHaveStyleRule("border-radius", "50%");
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    checkAltText();
    checkImageSource();
    checkStyle();
  });
});
