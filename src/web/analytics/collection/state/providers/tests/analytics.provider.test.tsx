import { render } from "@testing-library/react";
import React from "react";
import AnalyticsProvider, { AnalyticsContext } from "../analytics.provider";
import type { AnalyticsContextInterface } from "@src/web/analytics/collection/types/state/provider.types";

describe("AnalyticsProvider", () => {
  const received: Partial<AnalyticsContextInterface> = {};

  const arrange = () => {
    render(
      <AnalyticsProvider>
        <AnalyticsContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {JSON.stringify(Object.assign(received, state))}
            </div>
          )}
        </AnalyticsContext.Consumer>
      </AnalyticsProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should contain the expected properties", () => {
      const properties = received as AnalyticsContextInterface;
      expect(typeof properties.initialized).toBe("boolean");
      expect(typeof properties.setInitialized).toBe("function");
    });
  });
});
