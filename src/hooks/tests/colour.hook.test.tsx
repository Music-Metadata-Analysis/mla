import { renderHook } from "@testing-library/react-hooks";
import useColour from "../colour";

describe("useColour", () => {
  let received: ReturnType<typeof arrange>;

  const arrange = () => {
    return renderHook(() => useColour());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    const assertIsString = (property: string) => {
      expect(typeof property).toBe("string");
    };

    it("should contain the bodyColour background color", () => {
      assertIsString(received.result.current.bodyColour.background);
    });

    it("should contain the componentColour properties", () => {
      assertIsString(received.result.current.componentColour.background);
      assertIsString(received.result.current.componentColour.foreground);
      assertIsString(received.result.current.componentColour.details);
      assertIsString(received.result.current.componentColour.scheme);
    });

    it("should contain the buttonColour properties", () => {
      assertIsString(received.result.current.buttonColour.background);
      assertIsString(received.result.current.buttonColour.foreground);
      assertIsString(received.result.current.buttonColour.border);
    });
  });
});
