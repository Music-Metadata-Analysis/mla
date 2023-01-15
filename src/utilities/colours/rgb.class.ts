import RGBA from "./rgba.class";

export default class RGB {
  private rgb: string;

  constructor(rgb: string) {
    this.rgb = rgb;
  }

  public getRGB = (): string => {
    return this.rgb;
  };

  public addAlpha = (alpha: number): RGBA => {
    const digits: number[] = this.rgb
      .replace("rgb", "")
      .replace("(", "")
      .replace(")", "")
      .split(",")
      .map((n) => parseInt(n));
    digits.push(alpha);
    return new RGBA(`rgba(${digits.join(",")})`);
  };
}
