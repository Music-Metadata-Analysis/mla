import { extendTheme } from "@chakra-ui/react";
import createTheme from "../ui.chakra.theme";

jest.mock("@chakra-ui/react", () => {
  return {
    extendTheme: jest.fn((props) => props),
  };
});

describe("theme", () => {
  let result: Record<string, string>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    result = createTheme();
  };

  describe("when called", () => {
    it("should call extendTheme", async () => {
      arrange();
      expect(extendTheme).toBeCalledTimes(1);
    });

    it("should generate the expected body", async () => {
      expect(result).toStrictEqual({
        styles: {
          global: {
            body: {
              fontFamily: "body",
              lineHeight: "base",
            },
          },
        },
      });
    });
  });
});
