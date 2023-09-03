import VerticalScrollBarDiv from "../vertical.scrollbar.layout.controller.utility.class";
import type { RefObject } from "react";

describe(VerticalScrollBarDiv.name, () => {
  let instance: VerticalScrollBarDiv;
  let currentProps: {
    scrollRef: RefObject<HTMLDivElement>;
    verticalAdjustment: number;
  };

  const verticalAdjustmentValue = 5;

  const baseProps = {
    scrollRef: { current: null },
    verticalAdjustment: verticalAdjustmentValue,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => (instance = new VerticalScrollBarDiv(currentProps));

  const createMockElement = () => {
    const element = document.createElement("div");
    Object.defineProperty(element, "clientHeight", {
      writable: true,
      configurable: true,
    });
    Object.defineProperty(element, "offsetHeight", {
      writable: true,
      configurable: true,
    });
    Object.defineProperty(element, "scrollHeight", {
      writable: true,
      configurable: true,
    });
    Object.defineProperty(element, "scrollTop", {
      writable: true,
      configurable: true,
    });
    return element;
  };

  const getCurrentReference = () =>
    currentProps.scrollRef.current as Omit<
      HTMLDivElement,
      "clientHeight" & "offsetHeight" & "scrollHeight" & "scrollTop"
    > & {
      clientHeight: number;
      offsetHeight: number;
      scrollHeight: number;
      scrollTop: number;
    };

  const resetProps = () => (currentProps = { ...baseProps });

  const checkRefGetter = () => {
    describe("ref getter", () => {
      it("should return the scrollRef prop from the ref getter", () => {
        expect(instance.ref).toBe(currentProps.scrollRef.current);
      });
    });
  };

  const checkRefSetter = () => {
    describe("ref setter", () => {
      const mockRef = document.createElement("div");

      beforeEach(() => (instance.ref = mockRef));

      it("should set the scrollRef prop with the ref setter", () => {
        expect(instance.ref).not.toBe(currentProps.scrollRef);
        expect(instance.ref).toBe(mockRef);
      });
    });
  };

  const checkOnScrollSetter = () => {
    describe("onscroll setter", () => {
      const mockFn = function () {
        return null;
      };

      beforeEach(() => (instance.onScroll = mockFn));

      it("should set the ref's onscroll method to the provided function", () => {
        expect(instance.ref?.onscroll).toBe(mockFn);
      });
    });
  };

  const checkOnScrollSetterFailsNull = () => {
    describe("onscroll setter", () => {
      const mockFn = function () {
        return null;
      };

      beforeEach(() => (instance.onScroll = mockFn));

      it("should NOT set the ref's onscroll method to the provided function", () => {
        expect(instance.ref?.onscroll).toBeNull();
      });
    });
  };

  const checkOnScrollSetterFailsUndefined = () => {
    describe("onscroll setter", () => {
      const mockFn = function () {
        return null;
      };

      beforeEach(() => (instance.onScroll = mockFn));

      it("should NOT set the ref's onscroll method to the provided function", () => {
        expect(instance.ref?.onscroll).toBeUndefined();
      });
    });
  };

  const checkRequiresScroll = ({ expected }: { expected: boolean }) => {
    describe("requiresScroll", () => {
      let result: boolean;

      beforeEach(() => (result = instance.requiresScroll()));

      it(`should return ${expected}`, () => {
        expect(result).toBe(expected);
      });
    });
  };

  const checkRefProperty = ({
    expectedClientHeight,
    expectedScrollHeight,
  }: {
    expectedClientHeight: number;
    expectedScrollHeight: number;
  }) => {
    describe("getRefProperty", () => {
      let retrievedClientHeight: number;
      let retrievedScrollHeight: number;

      beforeEach(() => {
        retrievedClientHeight = instance.getRefProperty("clientHeight");
        retrievedScrollHeight = instance.getRefProperty("scrollHeight");
      });

      it(`should return the expected clientHeight (${expectedClientHeight})`, () => {
        expect(retrievedClientHeight).toBe(expectedClientHeight);
      });

      it(`should return the expected scrollHeight (${expectedScrollHeight})`, () => {
        expect(retrievedScrollHeight).toBe(expectedScrollHeight);
      });
    });
  };

  const checkScrollAttributes = ({
    expectedScrollThumbSize,
    expectedScrollThumbOffset,
  }: {
    expectedScrollThumbSize: number;
    expectedScrollThumbOffset: number;
  }) => {
    describe("getScrollAttributes", () => {
      let result: {
        scrollThumbSize: number;
        scrollThumbOffset: number;
      };

      beforeEach(() => (result = instance.getScrollAttributes()));

      it(`should return the expected scrollThumbSize (${expectedScrollThumbSize})`, () => {
        expect(result.scrollThumbSize).toBe(expectedScrollThumbSize);
      });

      it(`should return the expected scrollThumbOffset (${expectedScrollThumbOffset})`, () => {
        expect(result.scrollThumbOffset).toBe(expectedScrollThumbOffset);
      });
    });
  };

  describe("when the passed a scroll ref that has a null value", () => {
    beforeEach(() => {
      currentProps.scrollRef = { current: null };

      arrange();
    });

    checkRefGetter();
    checkRefSetter();
    checkOnScrollSetterFailsUndefined();
    checkRequiresScroll({ expected: false });
    checkRefProperty({ expectedClientHeight: 0, expectedScrollHeight: 0 });
    checkScrollAttributes({
      expectedScrollThumbSize: 0,
      expectedScrollThumbOffset: 0,
    });
  });

  describe("when the passed a scroll ref that has a value", () => {
    beforeEach(() => {
      currentProps.scrollRef = { current: createMockElement() };
    });

    describe("when the passed a scroll ref's client height > scroll height'", () => {
      beforeEach(() => {
        getCurrentReference().clientHeight = 200;
        getCurrentReference().scrollHeight = 100;

        arrange();
      });

      checkRefGetter();
      checkRefSetter();
      checkOnScrollSetterFailsNull();
      checkRequiresScroll({ expected: false });
      checkRefProperty({
        expectedClientHeight: 200,
        expectedScrollHeight: 100,
      });
      checkScrollAttributes({
        expectedScrollThumbSize: 0,
        expectedScrollThumbOffset: 0,
      });
    });

    describe("when the passed a scroll ref's client height == scroll height'", () => {
      beforeEach(() => {
        getCurrentReference().clientHeight = 100;
        getCurrentReference().scrollHeight = 100;

        arrange();
      });

      checkRefGetter();
      checkRefSetter();
      checkOnScrollSetterFailsNull();
      checkRequiresScroll({ expected: false });
      checkRefProperty({
        expectedClientHeight: 100,
        expectedScrollHeight: 100,
      });
      checkScrollAttributes({
        expectedScrollThumbSize: 0,
        expectedScrollThumbOffset: 0,
      });
    });

    describe("when the passed a scroll ref's client height < scroll height'", () => {
      beforeEach(() => {
        getCurrentReference().clientHeight = 250;
        getCurrentReference().scrollHeight = 400;
      });

      describe("with a small scroll to viewable ratio", () => {
        beforeEach(() => {
          getCurrentReference().offsetHeight = 200;
          getCurrentReference().scrollTop = 100;

          arrange();
        });

        checkRefGetter();
        checkRefSetter();
        checkOnScrollSetter();
        checkRequiresScroll({ expected: true });
        checkRefProperty({
          expectedClientHeight: 250,
          expectedScrollHeight: 400,
        });
        checkScrollAttributes({
          expectedScrollThumbSize: 95,
          expectedScrollThumbOffset: 45,
        });
      });

      describe("with a large scroll to viewable ratio", () => {
        beforeEach(() => {
          getCurrentReference().offsetHeight = 25;
          getCurrentReference().scrollTop = 75;

          arrange();
        });

        checkRefGetter();
        checkRefSetter();
        checkOnScrollSetter();
        checkRequiresScroll({ expected: true });
        checkRefProperty({
          expectedClientHeight: 250,
          expectedScrollHeight: 400,
        });
        checkScrollAttributes({
          expectedScrollThumbSize: 3,
          expectedScrollThumbOffset: 0,
        });
      });
    });
  });
});
