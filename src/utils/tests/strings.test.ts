import { alwaysString, capitalize, singular, truncate } from "../strings";

describe("alwaysString", () => {
  let result: string;

  const arrange = (input: string | undefined | null) => {
    result = alwaysString(input);
  };

  describe("with a normal string", () => {
    beforeEach(() => arrange("aaaa"));

    it("should return the expected string", () => {
      expect(result).toBe("aaaa");
    });
  });

  describe("with a null input", () => {
    beforeEach(() => arrange(null));

    it("should return the expected string", () => {
      expect(result).toBe("");
    });
  });

  describe("with a undefined input", () => {
    beforeEach(() => arrange(undefined));

    it("should return the expected string", () => {
      expect(result).toBe("");
    });
  });
});

describe("capitalize", () => {
  let result: string;

  const arrange = (input: string) => {
    result = capitalize(input);
  };

  describe("with an all lowercase string", () => {
    beforeEach(() => arrange("aaaa bbbb cccc"));

    it("should return the expected string", () => {
      expect(result).toBe("Aaaa bbbb cccc");
    });
  });

  describe("with an all uppercase string", () => {
    beforeEach(() => arrange("AAAA BBBB CCCC"));

    it("should return the expected string", () => {
      expect(result).toBe("AAAA BBBB CCCC");
    });
  });

  describe("with a numeric string", () => {
    beforeEach(() => arrange("1234"));

    it("should return the expected string", () => {
      expect(result).toBe("1234");
    });
  });

  describe("with an empty string", () => {
    beforeEach(() => arrange(""));

    it("should return the expected string", () => {
      expect(result).toBe("");
    });
  });
});

describe("singular", () => {
  let result: string;

  const arrange = (input: string) => {
    result = singular(input);
  };

  describe("with a string ending in s", () => {
    beforeEach(() => arrange("aaaaas"));

    it("should return the expected string", () => {
      expect(result).toBe("aaaaa");
    });
  });

  describe("with a string ending in S", () => {
    beforeEach(() => arrange("aaaaaS"));

    it("should return the expected string", () => {
      expect(result).toBe("aaaaa");
    });
  });

  describe("with a string NOT ending in s or S", () => {
    beforeEach(() => arrange("aaaaa"));

    it("should return the expected string", () => {
      expect(result).toBe("aaaaa");
    });
  });
});

describe("truncate", () => {
  let maximumLength: number;
  let result: string;

  const createString = (length: number) => Array(length + 1).join("a");

  const arrange = (characters: number) => {
    result = truncate(createString(characters), maximumLength);
  };

  describe("with a maximum length of 20", () => {
    beforeEach(() => (maximumLength = 20));

    describe("with a test string of 10 characters", () => {
      beforeEach(() => arrange(10));

      it("should return the expected string", () => {
        expect(result).toBe(createString(10));
        expect(result.length).toBe(10);
      });
    });

    describe("with a test string of 19 characters", () => {
      beforeEach(() => arrange(19));

      it("should return the expected string", () => {
        expect(result).toBe(createString(19));
        expect(result.length).toBe(19);
      });
    });

    describe("with a test string of 20 characters", () => {
      beforeEach(() => arrange(20));

      it("should return the expected string", () => {
        expect(result).toBe(createString(20));
        expect(result.length).toBe(20);
      });
    });

    describe("with a test string of 21 characters", () => {
      beforeEach(() => arrange(21));

      it("should return the expected string", () => {
        expect(result).toBe(createString(17) + "...");
        expect(result.length).toBe(20);
      });
    });
  });

  describe("with a maximum length of 10", () => {
    beforeEach(() => (maximumLength = 10));

    describe("with a test string of 5 characters", () => {
      beforeEach(() => arrange(5));

      it("should return the expected string", () => {
        expect(result).toBe(createString(5));
        expect(result.length).toBe(5);
      });
    });

    describe("with a test string of 9 characters", () => {
      beforeEach(() => arrange(9));

      it("should return the expected string", () => {
        expect(result).toBe(createString(9));
        expect(result.length).toBe(9);
      });
    });

    describe("with a test string of 10 characters", () => {
      beforeEach(() => arrange(10));

      it("should return the expected string", () => {
        expect(result).toBe(createString(10));
        expect(result.length).toBe(10);
      });
    });

    describe("with a test string of 11 characters", () => {
      beforeEach(() => arrange(11));

      it("should return the expected string", () => {
        expect(result).toBe(createString(7) + "...");
        expect(result.length).toBe(10);
      });
    });
  });
});
