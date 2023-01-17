import { render } from "@testing-library/react";
import AnalyticsGenericWrapper from "../analytics.generic.component";
import AnalyticsGenericWrapperContainer from "../analytics.generic.container";
import Event from "@src/contracts/events/event.class";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@src/hooks/analytics.hook");

jest.mock("../analytics.generic.component", () =>
  require("@fixtures/react/parent").createComponent("AnalyticsGenericWrapper")
);

describe("AnalyticsGenericWrapperContainer", () => {
  const buttonText = "Click Me";
  const mockEvent = new Event({
    category: "TEST",
    label: "TEST",
    action: "Test Event",
    value: 0,
  });

  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <AnalyticsGenericWrapperContainer eventDefinition={mockEvent}>
        <button onClick={mockClick}>{buttonText}</button>
      </AnalyticsGenericWrapperContainer>
    );
  };

  it("should render the AnalyticsGenericWrapper as expected", () => {
    expect(AnalyticsGenericWrapper).toBeCalledTimes(1);
    checkMockCall(AnalyticsGenericWrapper, {}, 0, ["clickHandler"]);
  });
});
