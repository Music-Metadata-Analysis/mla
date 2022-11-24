import main from "@locales/main.json";
import { ids } from "@src/components/search/lastfm/select/select.report.identifiers";
import config from "@src/config/lastfm";
import routes from "@src/config/routes";

const checkSelectIndicatorToggle = ({
  reportConfig,
  timeout,
}: {
  reportConfig: {
    reportName: string;
    indicator: string;
  };
  timeout: number;
}) => {
  const getScrollArea = () =>
    cy.get(`[id=${ids.LastFMReportSelectScrollArea}]`);

  const getButton = () => getScrollArea().contains(reportConfig.reportName);

  describe("when we visit the search selection screen", () => {
    before(() => cy.visit(routes.search.lastfm.selection));

    it("should contain the lastfm logo", () => {
      cy.get(`[alt="${main.altText.lastfm}"]`).should("be.visible", {
        timeout,
      });
    });

    describe("when the screen is resized (Below Indicator Threshold)", () => {
      beforeEach(() => cy.viewport(config.select.indicatorWidth - 1, 768));

      describe("when we examine the element identified as the scroll area", () => {
        it(`should contain the '${reportConfig.reportName}' report button`, () => {
          getButton().should("be.visible", { timeout });
        });

        it("should NOT contain a report type indicator", () => {
          getScrollArea()
            .contains(reportConfig.indicator + ":")
            .should("not.exist", { timeout });
        });
      });
    });

    describe("when the screen is resized (Above Indicator Threshold)", () => {
      beforeEach(() => cy.viewport(config.select.indicatorWidth, 768));

      describe("when we examine the element identified as the scroll area", () => {
        it(`should contain the '${reportConfig.reportName}' report button`, () => {
          getButton().should("be.visible", { timeout });
        });

        it("should also contain a report type indicator, adjacent to the button", () => {
          getButton()
            .parent()
            .siblings()
            .contains(reportConfig.indicator + ":")
            .should("be.visible", { timeout });
        });
      });
    });
  });
};

export default checkSelectIndicatorToggle;
