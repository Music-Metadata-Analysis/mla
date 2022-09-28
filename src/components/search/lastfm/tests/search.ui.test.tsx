import { Box, Flex, Avatar, useToast } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import SearchContainer from "../search.container";
import SearchUI from "../search.ui";
import Authentication from "@src/components/authentication/authentication.container";
import Billboard from "@src/components/billboard/billboard.component";
import LastFMIcon from "@src/components/icons/lastfm/lastfm.icon";
import { mockUseLocale } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  const chakraMock = createChakraMock(["Box", "Flex"]);
  chakraMock.useToast = jest.fn();
  chakraMock.Avatar = jest.fn().mockImplementation(() => <div>MockAvatar</div>);
  return chakraMock;
});

jest.mock("@src/components/authentication/authentication.container", () =>
  jest.fn(() => <div>MockedAuthenticationComponent</div>)
);

jest.mock("@src/components/billboard/billboard.component", () =>
  require("@fixtures/react").createComponent("BillBoard")
);

jest.mock("../search.container", () =>
  require("@fixtures/react").createComponent("SearchContainer")
);

jest.mock("@src/components/icons/lastfm/lastfm.icon", () =>
  require("@fixtures/react").createComponent("LastFMIcon")
);

describe("SearchUI", () => {
  const testField = "test_field";
  const testMessage = "test_message";
  const mockTitle = "Mock Title";
  const mockRoute = "/some/fancy/route/here";
  const mockT = new mockUseLocale("lastfm");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<SearchUI t={mockT.t} title={mockTitle} route={mockRoute} />);
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should call Authentication with the correct props", () => {
      expect(Authentication).toBeCalledTimes(1);
      checkMockCall(Authentication, {});
    });

    it("should call Billboard with the correct props", () => {
      expect(Billboard).toBeCalledTimes(1);
      checkMockCall(Billboard, { title: mockTitle }, 0, []);
    });

    it("should call Flex as expected to center content", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(Flex, {
        align: "center",
        justify: "space-evenly",
        w: "100%",
      });
    });

    it("should call Box as expected to create a margin around the form", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(Box, {}, 0, []);
      checkMockCall(Box, { pl: 5 }, 1, []);
    });

    it("should call Avatar as expected to display the logo", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.width).toStrictEqual([50, 50, 75]);
      expect(renderToString(call.icon)).toBe(renderToString(<LastFMIcon />));
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call SearchContainer to display the search form", () => {
      expect(SearchContainer).toBeCalledTimes(1);
      checkMockCall(SearchContainer, { route: mockRoute, t: mockT.t }, 0, [
        "openError",
        "closeError",
      ]);
    });
  });

  describe("when the rendered error functions are called", () => {
    let openError: (fieldname: string, message: string) => void;
    let closeError: (fieldname: string) => void;
    type mockToastType = jest.Mock & {
      isActive: () => boolean;
      close: () => null;
      update: () => null;
    };

    const mockToast = jest.fn() as mockToastType;
    mockToast.isActive = () => true;
    mockToast.close = () => null;
    mockToast.update = () => null;

    describe("when a toast is present", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockToast.isActive = jest.fn(() => true);
        mockToast.close = jest.fn();
        mockToast.update = jest.fn();
        (useToast as jest.Mock).mockImplementation(() => mockToast);
        arrange();
        const call = (SearchContainer as jest.Mock).mock.calls[0][0];
        openError = call.openError;
        closeError = call.closeError;
      });

      describe("openError", () => {
        beforeEach(() => openError(testField, testMessage));

        it("should NOT generate a new toast", () => {
          expect(mockToast).toBeCalledTimes(0);
          expect(mockToast.isActive).toBeCalledTimes(1);
          expect(mockToast.close).toBeCalledTimes(0);
        });

        it("should update the toast", () => {
          expect(mockToast.update).toBeCalledTimes(1);
          expect(mockToast.update).toBeCalledWith(testField, {
            duration: 1000,
            isClosable: false,
            status: "error",
            title: testMessage,
          });
        });
      });

      describe("closeError", () => {
        beforeEach(() => closeError(testField));

        it("should close the toast toast", () => {
          expect(mockToast).toBeCalledTimes(0);
          expect(mockToast.isActive).toBeCalledTimes(1);
          expect(mockToast.close).toBeCalledTimes(1);
          expect(mockToast.close).toBeCalledWith(testField);
        });
      });
    });

    describe("when a toast is NOT present", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockToast.isActive = jest.fn(() => false);
        mockToast.close = jest.fn();
        (useToast as jest.Mock).mockImplementation(() => mockToast);
        arrange();
        const call = (SearchContainer as jest.Mock).mock.calls[0][0];
        openError = call.openError;
        closeError = call.closeError;
      });

      describe("openError", () => {
        beforeEach(() => openError(testField, testMessage));

        it("should generate a new toast", () => {
          expect(mockToast).toBeCalledTimes(1);
          expect(mockToast).toBeCalledWith({
            duration: 1000,
            id: testField,
            isClosable: false,
            status: "error",
            title: testMessage,
          });
          expect(mockToast.isActive).toBeCalledTimes(1);
          expect(mockToast.close).toBeCalledTimes(0);
        });
      });

      describe("closeError", () => {
        beforeEach(() => closeError(testField));

        it("should NOT close the toast toast", () => {
          expect(mockToast).toBeCalledTimes(0);
          expect(mockToast.isActive).toBeCalledTimes(1);
          expect(mockToast.close).toBeCalledTimes(0);
        });
      });
    });
  });
});
