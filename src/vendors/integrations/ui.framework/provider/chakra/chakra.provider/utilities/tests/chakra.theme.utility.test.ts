import { extendTheme } from "@chakra-ui/react";
import createChakraTheme, { components } from "../chakra.theme.utility";

jest.mock("@chakra-ui/react", () => ({
  extendTheme: jest.fn((props) => props),
}));

describe("createChakraTheme", () => {
  let result: Record<string, string>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    result = createChakraTheme();
  };

  describe("when called", () => {
    it("should call extendTheme", async () => {
      arrange();
      expect(extendTheme).toBeCalledTimes(1);
    });

    it("should generate the expected body", async () => {
      expect(result).toStrictEqual({
        config: {
          initialColorMode: "dark",
          useSystemColorMode: false,
        },
        styles: {
          global: {
            body: {
              fontFamily: "body",
              lineHeight: "base",
            },
          },
        },
        components,
      });
    });
  });
});
