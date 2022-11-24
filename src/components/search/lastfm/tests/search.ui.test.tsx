import { Box, Flex, Avatar, useToast } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import SearchContainer from "../search.container";
import SearchUI from "../search.ui";
import Authentication from "@src/components/authentication/authentication.container";
import BillboardContainer from "@src/components/billboard/billboard.base/billboard.container";
import LastFMIcon from "@src/components/icons/lastfm/lastfm.icon";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  const chakraMocks = createChakraMock(["Avatar", "Box", "Flex"]);
  chakraMocks.useToast = jest.fn();
  return chakraMocks;
});

jest.mock("@src/components/authentication/authentication.container", () =>
  require("@fixtures/react/child").createComponent(
    "MockedAuthenticationComponent"
  )
);

jest.mock("@src/components/billboard/billboard.base/billboard.container", () =>
  require("@fixtures/react/parent").createComponent("BillBoardContainer")
);

jest.mock("../search.container", () =>
  require("@fixtures/react/parent").createComponent("SearchContainer")
);

jest.mock("@src/components/icons/lastfm/lastfm.icon", () =>
  require("@fixtures/react/parent").createComponent("LastFMIcon")
);

describe("SearchUI", () => {
  let openError: (fieldname: string, message: string) => void;
  let closeError: (fieldname: string) => void;

  const testField = "test_field";
  const testMessage = "test_message";
  const mockTitle = "Mock Title";
  const mockRoute = "/some/fancy/route/here";
  const mockT = new MockUseLocale("lastfm");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<SearchUI t={mockT.t} titleText={mockTitle} route={mockRoute} />);
  };

  const assignErrorFunctions = () => {
    const call = jest.mocked(SearchContainer).mock.calls[0][0];
    openError = call.openError;
    closeError = call.closeError;
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should call Authentication with the correct props", () => {
      expect(Authentication).toBeCalledTimes(1);
      checkMockCall(Authentication, {});
    });

    it("should call BillboardContainer with the correct props", () => {
      expect(BillboardContainer).toBeCalledTimes(1);
      checkMockCall(BillboardContainer, { titleText: mockTitle }, 0, []);
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
      const call = jest.mocked(Avatar).mock.calls[0][0];
      expect(call.width).toStrictEqual([50, 50, 75]);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(renderToString(call.icon!)).toBe(renderToString(<LastFMIcon />));
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
    type chakraToastType = jest.Mock &
      Record<keyof ReturnType<typeof useToast>, jest.Mock>;
    const mockToast = jest.fn() as chakraToastType;
    mockToast.isActive = jest.fn();
    mockToast.close = jest.fn();
    mockToast.closeAll = jest.fn();
    mockToast.update = jest.fn();

    describe("when a toast is present", () => {
      beforeEach(() => {
        jest.mocked(mockToast.isActive).mockReturnValueOnce(true);
        jest.mocked(useToast).mockImplementation(() => mockToast);
        arrange();
        assignErrorFunctions();
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
        jest.mocked(mockToast.isActive).mockReturnValueOnce(false);
        jest.mocked(useToast).mockImplementation(() => mockToast);
        arrange();
        assignErrorFunctions();
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
