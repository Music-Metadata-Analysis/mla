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

    const assertLenIs = (
      object: Record<string, string | Record<string, string>>,
      length: number
    ) => {
      expect(Object.keys(object).length).toBe(length);
    };

    it("should contain the correct number of top level properties", () => {
      assertLenIs(received.result.current, 7);
    });

    it("should contain the bodyColour background color", () => {
      assertIsString(received.result.current.bodyColour.background);
      assertLenIs(received.result.current.bodyColour, 1);
    });

    it("should contain the buttonColour properties", () => {
      assertIsString(received.result.current.buttonColour.background);
      assertIsString(received.result.current.buttonColour.border);
      assertIsString(received.result.current.buttonColour.foreground);
      assertIsString(received.result.current.buttonColour.hoverBackground);
      assertLenIs(received.result.current.componentColour, 4);
    });

    it("should contain the componentColour properties", () => {
      assertIsString(received.result.current.componentColour.background);
      assertIsString(received.result.current.componentColour.foreground);
      assertIsString(received.result.current.componentColour.details);
      assertIsString(received.result.current.componentColour.scheme);
      assertLenIs(received.result.current.componentColour, 4);
    });

    it("should contain the flipCardColour properties", () => {
      assertIsString(received.result.current.flipCardColour.background);
      assertIsString(received.result.current.flipCardColour.border);
      assertIsString(received.result.current.flipCardColour.foreground);
      assertIsString(received.result.current.flipCardColour.textFront);
      assertIsString(received.result.current.flipCardColour.textRear);
      assertLenIs(received.result.current.flipCardColour, 5);
    });

    it("should contain the inputColour properties", () => {
      assertIsString(received.result.current.inputColour.background);
      assertIsString(received.result.current.inputColour.border);
      assertIsString(received.result.current.inputColour.foreground);
      assertLenIs(received.result.current.inputColour, 3);
    });

    it("should contain the navButtonColour properties", () => {
      assertIsString(received.result.current.navButtonColour.background);
      assertIsString(received.result.current.navButtonColour.hoverBackground);
      assertIsString(
        received.result.current.navButtonColour.selectedBackground
      );
      assertLenIs(received.result.current.navButtonColour, 3);
    });

    it("should contain an entry for transparent", () => {
      assertIsString(received.result.current.transparent);
    });
  });
});