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

    it("should contain the bodyColour background color", () => {
      expect(typeof received.result.current.bodyColour.background).toBe(
        "string"
      );
    });
  });
});
