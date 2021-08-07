import { waitFor, render } from "@testing-library/react";
import Head from "next/head";
import translation from "../../../../public/locales/en/main.json";
import settings from "../../../config/head";
import Header from "../header.component";

jest.mock("next/head", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

const MockNextHeader = ({
  children,
}: {
  children: Array<React.ReactElement>;
}) => {
  return <>{children}</>;
};

describe("Header Component", () => {
  const testTranslationKey = "default";

  beforeEach(() => {
    (Head as jest.Mock).mockImplementationOnce(MockNextHeader);
  });

  const getMeta = (metaName: string): string | null => {
    const metas = document.getElementsByTagName("meta");
    for (const meta of metas) {
      if (meta.name === metaName) {
        return meta.getAttribute("content");
      }
    }
    return null;
  };

  const getLink = (linkName: string): string | null => {
    const links = document.getElementsByTagName("link");
    for (const link of links) {
      if (link.rel === linkName) {
        return link.getAttribute("href");
      }
    }
    return null;
  };

  const arrange = () => {
    return render(<Header pageKey={testTranslationKey} />);
  };

  describe("When given a test pageKey", () => {
    beforeEach(() => {
      arrange();
    });

    it("sets the title appropriately", async () => {
      await waitFor(() =>
        expect(document.title).toEqual(translation.pages.default.title)
      );
    });

    it("should have the correct description metadata set", async () => {
      await waitFor(() =>
        expect(getMeta("description")).toEqual(
          translation.pages.default.description
        )
      );
    });

    it("should have the correct favicon link set", async () => {
      await waitFor(() => expect(getLink("icon")).toEqual(settings.favicon));
    });

    it("should have the correct apple touch icon link set", async () => {
      await waitFor(() =>
        expect(getLink("apple-touch-icon")).toEqual(settings.appleTouchIcon)
      );
    });
  });
});
