import { render } from "@testing-library/react";
import ReportTitle from "../report.title.component";
import ReportTitleContainer from "../report.title.container";

jest.mock("../report.title.component", () =>
  require("@fixtures/react/child").createComponent("ReportTitle")
);

describe("ReportTitleContainer", () => {
  const testProps = {
    title: "MockTitle",
    userName: "niall-Byrne" as string | null,
    size: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<ReportTitleContainer {...testProps} />);
  };

  describe("when username is defined", () => {
    beforeEach(() => {
      testProps.userName = "niall-byrne";

      arrange();
    });

    it("should call ReportTitle with the correct props", () => {
      expect(ReportTitle).toBeCalledTimes(1);
      expect(ReportTitle).toBeCalledWith(testProps, {});
    });
  });

  describe("when username is NOT defined", () => {
    beforeEach(() => {
      testProps.userName = null;

      arrange();
    });

    it("should NOT call ReportTitle", () => {
      expect(ReportTitle).toBeCalledTimes(0);
    });
  });
});
