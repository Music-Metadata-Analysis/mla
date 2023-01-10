import { waitFor, render } from "@testing-library/react";
import Header, { HeaderProps } from "../header.component";
import settings from "@src/config/head";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import { mockHeadShim } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";

jest.mock("@src/vendors/integrations/web.framework/vendor");

describe("Header", () => {
  const currentProps: HeaderProps = {
    descriptionText: "mockDescriptionText",
    titleText: "mockTitleText",
  };

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
    return render(<Header {...currentProps} />);
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should render the web framework's HeadShim component", () => {
      expect(mockHeadShim).toBeCalledTimes(1);
      checkMockCall(mockHeadShim, {}, 0);
    });

    it("sets the title appropriately", async () => {
      await waitFor(() =>
        expect(document.title).toEqual(currentProps.titleText)
      );
    });

    it("should have the correct description metadata set", async () => {
      await waitFor(() =>
        expect(getMeta("description")).toEqual(currentProps.descriptionText)
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
