const isNextSSR = () => typeof global.window === "undefined";

export default isNextSSR;
