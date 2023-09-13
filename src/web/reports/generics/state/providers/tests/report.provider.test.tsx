import { render } from "@testing-library/react";
import React from "react";
import { InitialState } from "../report.initial";
import ReportProvider, { ReportContext } from "../report.provider";
import type { ReportContextInterface } from "@src/web/reports/generics/types/state/providers/report.context.types";

describe("ReportProvider", () => {
  const received: Partial<ReportContextInterface> = {};

  const arrange = () => {
    render(
      <ReportProvider>
        <ReportContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {JSON.stringify(Object.assign(received, state))}
            </div>
          )}
        </ReportContext.Consumer>
      </ReportProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should contain the expected properties", () => {
      const properties = received as ReportContextInterface;
      expect(properties.dispatch).toBeInstanceOf(Function);
      expect(properties.reportProperties).toStrictEqual(InitialState);
    });
  });
});
