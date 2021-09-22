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
  isLocaleDomain: true,
  isPreview: false,
  back: jest.fn(() => Promise.resolve()),
  beforePopState: jest.fn(() => null),
  push: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(() => Promise.resolve()),
  replace: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
};

export default mockRouter;
