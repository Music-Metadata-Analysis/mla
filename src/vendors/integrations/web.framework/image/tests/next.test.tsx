/* Testing Library */
import { render } from "@testing-library/react";
import Image from "next/image";
import NextImageShim from "../next";
import LastFM from "@public/images/lastfm.png";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("next/image", () =>
  require("@fixtures/react/child").createComponent("NextImage")
);

describe("NextImageShim", () => {
  const mockAltText = "altText";
  const mockHeight = 200;
  const mockSrc = LastFM;
  const mockWidth = 200;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <NextImageShim
        alt={mockAltText}
        height={mockHeight}
        src={mockSrc}
        width={mockWidth}
      />
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the underlying Next/Image implementation", () => {
      expect(Image).toBeCalledTimes(1);
      checkMockCall(Image, {
        alt: mockAltText,
        height: mockHeight,
        src: mockSrc,
        width: mockWidth,
      });
    });
  });
});
