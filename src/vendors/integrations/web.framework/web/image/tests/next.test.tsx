/* Testing Library */
import { render } from "@testing-library/react";
import Image from "next/image";
import NextImageShim from "../next";
import LastFM from "@public/images/lastfm.png";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { isTest } from "@src/utilities/generics/env";

jest.mock("next/image", () =>
  require("@fixtures/react/child").createComponent("NextImage")
);

jest.mock("@src/utilities/generics/env");

describe("NextImageShim", () => {
  const mockAltText = "altText";
  const mockSrc = LastFM;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<NextImageShim alt={mockAltText} src={mockSrc} />);
  };

  describe("when rendered", () => {
    describe("when in a test environment", () => {
      beforeEach(() => {
        jest.mocked(isTest).mockReturnValue(true);

        arrange();
      });

      it("should call the underlying Next/Image implementation correctly", () => {
        expect(Image).toHaveBeenCalledTimes(1);
        checkMockCall(Image, {
          alt: mockAltText,
          fill: true,
          quality: 100,
          src: mockSrc,
        });
      });
    });

    describe("when NOT in a test environment", () => {
      beforeEach(() => {
        jest.mocked(isTest).mockReturnValue(false);

        arrange();
      });

      it("should call the underlying Next/Image implementation correctly", () => {
        expect(Image).toHaveBeenCalledTimes(1);
        checkMockCall(Image, {
          alt: mockAltText,
          fill: false,
          quality: 100,
          src: mockSrc,
        });
      });
    });
  });
});
