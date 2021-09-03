import { Avatar } from "@chakra-ui/react";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import mockAnalyticsHook from "../../../../hooks/tests/analytics.mock";
import LastFMIcon from "../../../icons/lastfm/lastfm.icon";
import NavBarAvatar, { testIDs } from "../navbar.avatar.component";

jest.mock("@chakra-ui/react", () => {
  return {
    Avatar: jest.fn().mockImplementation(() => <div>MockComponent</div>),
    Box: jest.requireActual("@chakra-ui/react").Box,
  };
});

jest.mock("../../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

describe("NavBarAvatar", () => {
  let link: HTMLElement;
  const mockHref = "https://google.ca";
  const mockImage = "https://imagesite.com/image.jpeg";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (image: string) => {
    render(<NavBarAvatar image={image} href={mockHref} />);
  };

  describe("with an image specified", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      arrange(mockImage);
    });

    it("should render the <a> tag component correctly", async () => {
      expect(
        await screen.findByTestId(testIDs.NavBarAvatarLink)
      ).toHaveAttribute("target", "_blank");
    });

    it("should render the Avatar component correctly", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.cursor).toBe("pointer");
      expect(call.loading).toBe("eager");
      expect(call.size).toBe("sm");
      expect(call.src).toBe(mockImage);
      expect(renderToString(call.icon)).toBe(renderToString(<LastFMIcon />));
    });

    describe("when clicked", () => {
      beforeEach(async () => {
        link = await screen.findByTestId(testIDs.NavBarAvatarLink);
        if (link && link.firstChild) {
          fireEvent.click(link.firstChild);
        }
      });

      it("should call the button tracker correctly", () => {
        expect(mockAnalyticsHook.trackButtonClick).toBeCalledTimes(1);
        const call = mockAnalyticsHook.trackButtonClick.mock.calls[0];
        expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
        expect(call[1]).toBe("AVATAR: PROFILE");
        expect(Object.keys(call).length).toBe(2);
      });
    });
  });

  describe("with no image specified", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      arrange("");
    });

    it("should render the <a> tag component correctly", async () => {
      expect(
        await screen.findByTestId(testIDs.NavBarAvatarLink)
      ).toHaveAttribute("target", "_blank");
    });

    it("should render the Avatar component correctly", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.cursor).toBe("pointer");
      expect(call.loading).toBe("eager");
      expect(call.size).toBe("sm");
      expect(call.src).toBe("");
      expect(renderToString(call.icon)).toBe(renderToString(<LastFMIcon />));
    });

    describe("when clicked", () => {
      beforeEach(async () => {
        link = await screen.findByTestId(testIDs.NavBarAvatarLink);
        if (link && link.firstChild) {
          fireEvent.click(link.firstChild);
        }
      });

      it("should call the button tracker correctly", () => {
        expect(mockAnalyticsHook.trackButtonClick).toBeCalledTimes(1);
        const call = mockAnalyticsHook.trackButtonClick.mock.calls[0];
        expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
        expect(call[1]).toBe("AVATAR: LASTFM");
        expect(Object.keys(call).length).toBe(2);
      });
    });
  });
});
