import RGB from "../rgb.class";
import RGBA from "../rgba.class";

describe(RGB.name, () => {
  let instance: RGB;
  let arg: string;

  const arrange = () => (instance = new RGB(arg));

  describe("when initialized with a proper rgb string", () => {
    beforeEach(() => {
      arg = "rgb(10,20,30)";
      arrange();
    });

    describe("getRGB", () => {
      let result: string;

      beforeEach(() => (result = instance.getRGB()));

      it("should return the correct result", () => {
        expect(result).toBe(arg);
      });
    });

    describe("addAlpha", () => {
      let result: RGBA;
      let opacity: number;

      describe("with an opacity of 1", () => {
        beforeEach(() => {
          opacity = 1;
          result = instance.addAlpha(opacity);
        });

        it("should return a RGBA class instance", () => {
          expect(result).toBeInstanceOf(RGBA);
        });

        describe("the RGBA class instance", () => {
          it("should return the expected rgba string", () => {
            expect(result.getRGBA()).toBe(`rgba(10,20,30,${opacity})`);
          });
        });
      });

      describe("with an opacity of 0", () => {
        beforeEach(() => {
          opacity = 0;
          result = instance.addAlpha(opacity);
        });

        it("should return a RGBA class instance", () => {
          expect(result).toBeInstanceOf(RGBA);
        });

        describe("the RGBA class instance", () => {
          it("should return the expected rgba string", () => {
            expect(result.getRGBA()).toBe(`rgba(10,20,30,${opacity})`);
          });
        });
      });
    });
  });
});
