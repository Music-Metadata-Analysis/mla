// Mock next/image for compatibility with jest

import * as nextImage from "next/image";

Object.defineProperty(nextImage, "default", {
  configurable: true,
  value: (props) => {
    /* eslint-disable jsx-a11y/alt-text */
    /* eslint-disable @next/next/no-img-element */
    return <img {...props} />;
  },
});
