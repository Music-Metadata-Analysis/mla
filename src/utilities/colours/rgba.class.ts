export default class RGBA {
  private rgba: string;

  constructor(rgba: string) {
    this.rgba = rgba;
  }

  public getRGBA = (): string => {
    return this.rgba;
  };

  public getAlpha = (): number => {
    const opacity = parseFloat(
      this.rgba
        .replace("rgba", "")
        .replace("(", "")
        .replace(")", "")
        .split(",")[3]
    );
    return opacity;
  };
}
