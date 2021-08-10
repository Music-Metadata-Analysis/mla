import { extendTheme } from "@chakra-ui/react";
import createTheme from "../ui.theme";

jest.mock("@chakra-ui/react", () => {
  return {
    extendTheme: jest.fn(),
  };
});

jest.mock("@chakra-ui/theme-tools", () => {
  return {
    mode: jest.fn().mockImplementation((arg1: string, arg2: string) => () => {
      return [arg1, arg2];
    }),
  };
});

describe("theme", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    createTheme();
  };

  const getStyleFunction = () =>
    (extendTheme as jest.Mock).mock.calls[0][0].styles.global;

  describe("when called", () => {
    beforeEach(() => arrange());

    it("should generate the expected style function", async () => {
      expect(extendTheme).toBeCalledTimes(1);
      expect(typeof getStyleFunction()).toBe("function");
    });

    describe("the style function", () => {
      let result: Record<string, string>;
      beforeEach(() => (result = getStyleFunction()({})));

      it("should generate the expected body", async () => {
        expect(result).toStrictEqual({
          body: {
            fontFamily: "body",
            color: ["gray.900", "gray.100"],
            bg: ["gray.400", "gray.600"],
            lineHeight: "base",
          },
        });
      });
    });
  });
});
