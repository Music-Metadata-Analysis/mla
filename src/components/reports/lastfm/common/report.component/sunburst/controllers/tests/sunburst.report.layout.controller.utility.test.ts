import {
  calculateCanFitOnScreen,
  calculateLayoutType,
} from "../sunburst.report.layout.controller.utility";
import settings from "@src/config/sunburst";
import type { RefObject } from "react";

describe("calculateCanFitOnScreen", () => {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  afterAll(() => {
    window.innerHeight = windowHeight;
    window.innerWidth = windowWidth;
  });

  beforeEach(() => jest.clearAllMocks());

  describe("when the screen is tall", () => {
    beforeEach(() => {
      window.innerHeight = settings.minimumHeight;
    });

    describe("but wide", () => {
      beforeEach(() => {
        window.innerWidth = settings.minimumWidth;
      });

      it("should return true", () => {
        expect(calculateCanFitOnScreen()).toBe(true);
      });
    });

    describe("but narrow", () => {
      beforeEach(() => {
        window.innerWidth = settings.minimumCompactWidth;
      });

      it("should return true", () => {
        expect(calculateCanFitOnScreen()).toBe(true);
      });
    });

    describe("but too narrow", () => {
      beforeEach(() => {
        window.innerWidth = settings.minimumCompactWidth - 1;
      });

      it("should return false ", () => {
        expect(calculateCanFitOnScreen()).toBe(false);
      });
    });
  });

  describe("when the screen is short", () => {
    beforeEach(() => {
      window.innerHeight = settings.minimumCompactHeight;
    });

    describe("but wide", () => {
      beforeEach(() => {
        window.innerWidth = settings.minimumWidth;
      });

      it("should return true", () => {
        expect(calculateCanFitOnScreen()).toBe(true);
      });
    });

    describe("but narrow", () => {
      beforeEach(() => {
        window.innerWidth = settings.minimumCompactWidth;
      });

      it("should return false", () => {
        expect(calculateCanFitOnScreen()).toBe(false);
      });
    });

    describe("but too narrow", () => {
      beforeEach(() => {
        window.innerWidth = settings.minimumCompactWidth - 1;
      });

      it("should return false ", () => {
        expect(calculateCanFitOnScreen()).toBe(false);
      });
    });
  });

  describe("when the screen is too short", () => {
    beforeEach(() => {
      window.innerHeight = settings.minimumCompactHeight - 1;
    });

    describe("but wide", () => {
      beforeEach(() => {
        window.innerWidth = settings.minimumWidth;
      });

      it("should return false", () => {
        expect(calculateCanFitOnScreen()).toBe(false);
      });
    });

    describe("but narrow", () => {
      beforeEach(() => {
        window.innerWidth = settings.minimumCompactWidth;
      });

      it("should return false", () => {
        expect(calculateCanFitOnScreen()).toBe(false);
      });
    });

    describe("but too narrow", () => {
      beforeEach(() => {
        window.innerWidth = settings.minimumCompactWidth - 1;
      });

      it("should return false ", () => {
        expect(calculateCanFitOnScreen()).toBe(false);
      });
    });
  });
});

describe("calculateLayoutType", () => {
  const clientHeight = 600;
  const clientWidth = 600;
  const mockRef = () =>
    ({
      current: { clientWidth, clientHeight },
    } as RefObject<HTMLDivElement>);
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  afterAll(() => {
    window.innerHeight = windowHeight;
    window.innerWidth = windowWidth;
  });

  beforeEach(() => jest.clearAllMocks());

  describe("when the screen is tall enough to support normal", () => {
    beforeEach(() => {
      window.innerHeight = clientHeight * 2 + settings.navbarOffset;
    });

    describe("but it's too narrow for compact", () => {
      beforeEach(() => {
        window.innerWidth = clientWidth * 2 - 1;
      });

      it("should return normal", () => {
        expect(calculateLayoutType(mockRef(), mockRef())).toBe("normal");
      });
    });

    describe("but it's wide enough for compact", () => {
      beforeEach(() => {
        window.innerWidth = clientWidth * 2 + 1;
      });

      it("should return compact", () => {
        expect(calculateLayoutType(mockRef(), mockRef())).toBe("compact");
      });
    });
  });

  describe("when the screen is NOT tall enough to support normal", () => {
    beforeEach(() => {
      window.innerHeight = clientHeight * 2 + settings.navbarOffset - 1;
    });

    describe("but it's narrow for compact", () => {
      beforeEach(() => {
        window.innerWidth = clientWidth * 2 - 1;
      });

      it("should return normal", () => {
        expect(calculateLayoutType(mockRef(), mockRef())).toBe("normal");
      });
    });

    describe("but it's wide enough for compact", () => {
      beforeEach(() => {
        window.innerWidth = clientWidth * 2 + 1;
      });

      it("should return compact", () => {
        expect(calculateLayoutType(mockRef(), mockRef())).toBe("normal");
      });
    });
  });

  describe("when the refs have no clientWidth or clientHeight", () => {
    it("should return compact", () => {
      expect(calculateLayoutType({ current: null }, { current: null })).toBe(
        "compact"
      );
    });
  });
});
