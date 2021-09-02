import mockRouterPrototype from "next-router-mock";
import type { NextRouter } from "next/router";

export const mockWindowResponse = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    hash: {
      endsWith: mockWindowResponse,
      includes: mockWindowResponse,
    },
    assign: mockWindowResponse,
  },
  writable: true,
});

const mockRouter: NextRouter = {
  ...mockRouterPrototype,
  push: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(() => Promise.resolve()),
  isLocaleDomain: true,
  prefetch: jest.fn(() => Promise.resolve()),
  isPreview: false,
};

export default mockRouter;
