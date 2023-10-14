import { render } from "@testing-library/react";
import React from "react";
import AnalyticsProvider, { AnalyticsContext } from "../analytics.provider";
import type { AnalyticsVendorContextInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

describe("AnalyticsProvider", () => {
  const received: Partial<AnalyticsVendorContextInterface> = {};

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
      const properties = received as AnalyticsVendorContextInterface;
      expect(typeof properties.initialized).toBe("boolean");
      expect(typeof properties.setInitialized).toBe("function");
    });
  });
});
