import RGBA from "../rgba.class";

describe(RGBA.name, () => {
  let instance: RGBA;
  let arg: string;
  let alpha: number;

  const arrange = () => {
    arg = `rgb(10,20,30,${alpha})`;
    instance = new RGBA(arg);
  };

  describe("when initialized with a proper rgba string (opacity 0)", () => {
    beforeEach(() => {
      alpha = 0;
      arrange();
    });

    describe("getRGBA", () => {
      let result: string;

      beforeEach(() => (result = instance.getRGBA()));

      it("should return the correct result", () => {
        expect(result).toBe(arg);
      });
    });

    describe("getAlpha", () => {
      let result: number;

      beforeEach(() => {
        result = instance.getAlpha();
      });

      it("should return the alpha channel value", () => {
        expect(result).toBe(alpha);
      });
    });
  });

  describe("when initialized with a proper rgba string (opacity 1)", () => {
    beforeEach(() => {
      alpha = 1;
      arrange();
    });

    describe("getRGBA", () => {
      let result: string;

      beforeEach(() => (result = instance.getRGBA()));

      it("should return the correct result", () => {
        expect(result).toBe(arg);
      });
    });

    describe("getAlpha", () => {
      let result: number;

      beforeEach(() => {
        result = instance.getAlpha();
      });

      it("should return the alpha channel value", () => {
        expect(result).toBe(alpha);
      });
    });
  });

  describe("when initialized with a proper rgba string (opacity 0.5)", () => {
    beforeEach(() => {
      alpha = 0.5;
      arrange();
    });

    describe("getRGBA", () => {
      let result: string;

      beforeEach(() => (result = instance.getRGBA()));

      it("should return the correct result", () => {
        expect(result).toBe(arg);
      });
    });

    describe("getAlpha", () => {
      let result: number;

      beforeEach(() => {
        result = instance.getAlpha();
      });

      it("should return the alpha channel value", () => {
        expect(result).toBe(alpha);
      });
    });
  });
});
