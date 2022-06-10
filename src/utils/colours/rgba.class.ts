export default class RGBA {
  private rgba: string;

  constructor(rgba: string) {
    this.rgba = rgba;
  }

  getRGBA = () => {
    return this.rgba;
  };

  getAlpha = () => {
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
