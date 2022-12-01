import VerticalScrollBarDiv from "../vertical.scrollbar.layout.controller.utility.class";

jest.mock("../vertical.scrollbar.layout.controller.utility.class");

const mockValues = {
  scrollBarDiv: new VerticalScrollBarDiv({
    scrollRef: { current: null },
    verticalAdjustment: 5,
  }),
  scrollThumbSize: 10,
  scrollThumbOffset: 20,
};

export default mockValues;
