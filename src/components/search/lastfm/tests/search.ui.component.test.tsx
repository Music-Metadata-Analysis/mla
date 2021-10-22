import { Box, Flex, Avatar, useToast } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import Authentication from "../../../authentication/authentication.container";
import Billboard from "../../../billboard/billboard.component";
import LastFMIcon from "../../../icons/lastfm/lastfm.icon";
import SearchContainer from "../search.container.component";
import SearchUI from "../search.ui.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  const chakraMock = factoryInstance.create(["Box", "Flex"]);
  chakraMock.useToast = jest.fn();
  chakraMock.Avatar = jest.fn().mockImplementation(() => <div>MockAvatar</div>);
  return chakraMock;
});

jest.mock("../../../authentication/authentication.container", () =>
  jest.fn(() => <div>MockedAuthenticationComponent</div>)
);

jest.mock("../../../billboard/billboard.component", () =>
  createMockedComponent("BillBoard")
);

jest.mock("../search.container.component", () => {
  return {
    __esModule: true,
    default: createMock("SearchComponent"),
  };
});

jest.mock("../../../icons/lastfm/lastfm.icon", () => {
  return {
    __esModule: true,
    default: createMock("LastFMIcon"),
  };
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

const createMock = (name: string) =>
  jest.fn(({ children }: { children: React.ReactChildren }) => {
    return <div data-testid={name}>{children}</div>;
  });

describe("SearchUI", () => {
  const testField = "test_field";
  const testMessage = "test_message";
  const mockTitle = "Mock Title";
  const mockRoute = "/some/fancy/route/here";
  const mockT = jest.fn((arg: string) => `t(${arg})`);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<SearchUI t={mockT} title={mockTitle} route={mockRoute} />);
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
      checkMockCall(Flex, { align: "center", justify: "space-between" });
    });

    it("should call Box as expected to create a margin around the form", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(Box, { mb: 10 }, 0, []);
      checkMockCall(Box, { pl: [5, 5, 10], w: "100%" }, 1, []);
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
      checkMockCall(SearchContainer, { route: mockRoute }, 0, [
        "openError",
        "closeError",
        "t",
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
