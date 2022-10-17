import { renderHook, act } from "@testing-library/react-hooks";
import createLocalStorageState from "../state.hook.factory";

describe("createLocalStorageState", () => {
  let received: ReturnType<typeof arrange>;

  let setItem: jest.SpyInstance<void, [key: string, value: string]>;
  let getItem: jest.SpyInstance<string | null | undefined, [key: string]>;

  const mockInitialValue = { mock: "mockInitialValue" };
  const mockStorageKey = "mockStorageKey";
  const mockStorageValue = { mock: "mockStorageValue" };
  const mockError = new Error("MockError");

  const mockFunction = (prevState: { mock: string }) => ({
    mock: prevState.mock + ">FunctionReturn",
  });

  beforeEach(() => {
    jest.clearAllMocks();
    setItem = jest.spyOn(Storage.prototype, "setItem");
    getItem = jest.spyOn(Storage.prototype, "getItem");
  });

  afterAll(() => {
    setItem.mockRestore();
    getItem.mockRestore();
  });

  const arrange = () => {
    return renderHook(() =>
      createLocalStorageState(mockStorageKey)(mockInitialValue)
    );
  };

  describe("getter", () => {
    describe("with no existing local storage value", () => {
      beforeEach(() => {
        getItem.mockReturnValueOnce(undefined);

        received = arrange();
      });

      it("should call the underlying local storage getItem method", () => {
        expect(getItem).toBeCalledTimes(1);
        expect(getItem).toBeCalledWith(mockStorageKey);
      });

      it("should should update the hook's current value to the initial value", () => {
        expect(received.result.current[0]).toStrictEqual(mockInitialValue);
      });
    });

    describe("with an existing local storage value", () => {
      beforeEach(() => {
        getItem.mockReturnValueOnce(JSON.stringify(mockStorageValue));

        received = arrange();
      });

      it("should call the underlying local storage getItem method", () => {
        expect(getItem).toBeCalledTimes(1);
        expect(getItem).toBeCalledWith(mockStorageKey);
      });

      it("should should update the hook's current value to the local storage value", () => {
        expect(received.result.current[0]).toStrictEqual(mockStorageValue);
      });
    });

    describe("with an error during data access", () => {
      let consoleErrorSpy: jest.SpyInstance<
        void,
        [message?: unknown, ...optionalParams: unknown[]]
      >;

      beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, "error");
        consoleErrorSpy.mockImplementation(() => null);
        getItem.mockImplementationOnce(() => {
          throw mockError;
        });

        received = arrange();
      });

      afterEach(() => consoleErrorSpy.mockRestore());

      it("should log an error message", () => {
        expect(consoleErrorSpy).toBeCalledTimes(1);
        expect(consoleErrorSpy).toBeCalledWith(mockError);
      });

      it("should call the underlying local storage getItem method", () => {
        expect(getItem).toBeCalledTimes(1);
        expect(getItem).toBeCalledWith(mockStorageKey);
      });

      it("should should update the hook's current value to the initial value", () => {
        expect(received.result.current[0]).toStrictEqual(mockInitialValue);
      });
    });
  });

  describe("setter", () => {
    describe("with no existing local storage value", () => {
      beforeEach(() => {
        getItem.mockReturnValueOnce(undefined);
      });

      describe("when called with a new value", () => {
        beforeEach(() => {
          received = arrange();

          act(() => received.result.current[1](mockStorageValue));
        });

        it("should call the underlying local storage setItem method", () => {
          expect(setItem).toBeCalledTimes(1);
          expect(setItem).toBeCalledWith(
            mockStorageKey,
            JSON.stringify(mockStorageValue)
          );
        });

        it("should update the hook's current value to the specified value", () => {
          expect(received.result.current[0]).toBe(mockStorageValue);
        });
      });

      describe("when called with a function", () => {
        beforeEach(() => {
          received = arrange();

          act(() => received.result.current[1](mockFunction));
        });

        it("should call the underlying local storage setItem method", () => {
          expect(setItem).toBeCalledTimes(1);
          expect(setItem).toBeCalledWith(
            mockStorageKey,
            JSON.stringify(mockFunction(mockInitialValue))
          );
        });

        it("should should update the hook's current value to the function's return value", () => {
          expect(received.result.current[0]).toStrictEqual(
            mockFunction(mockInitialValue)
          );
        });
      });
    });

    describe("with an existing local storage value", () => {
      beforeEach(() => {
        getItem.mockReturnValueOnce(JSON.stringify(mockStorageValue));
      });

      describe("when called with a new value", () => {
        beforeEach(() => {
          received = arrange();

          act(() => received.result.current[1](mockStorageValue));
        });

        it("should call the underlying local storage setItem method", () => {
          expect(setItem).toBeCalledTimes(1);
          expect(setItem).toBeCalledWith(
            mockStorageKey,
            JSON.stringify(mockStorageValue)
          );
        });

        it("should update the hook's current value to the specified value", () => {
          expect(received.result.current[0]).toBe(mockStorageValue);
        });
      });

      describe("when called with a function", () => {
        beforeEach(() => {
          received = arrange();

          act(() => received.result.current[1](mockFunction));
        });

        it("should call the underlying local storage setItem method", () => {
          expect(setItem).toBeCalledTimes(1);
          expect(setItem).toBeCalledWith(
            mockStorageKey,
            JSON.stringify(mockFunction(mockStorageValue))
          );
        });

        it("should should update the hook's current value to the function's return value", () => {
          expect(received.result.current[0]).toStrictEqual(
            mockFunction(mockStorageValue)
          );
        });
      });
    });

    describe("with an error during data writing", () => {
      let consoleErrorSpy: jest.SpyInstance<
        void,
        [message?: unknown, ...optionalParams: unknown[]]
      >;

      beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, "error");
        consoleErrorSpy.mockImplementation(() => null);
        getItem.mockReturnValueOnce(JSON.stringify(mockStorageValue));
        setItem.mockImplementationOnce(() => {
          throw mockError;
        });
      });

      afterEach(() => consoleErrorSpy.mockRestore());

      describe("when called with a new value", () => {
        beforeEach(() => {
          received = arrange();

          act(() => received.result.current[1](mockStorageValue));
        });

        it("should log an error message", () => {
          expect(consoleErrorSpy).toBeCalledTimes(1);
          expect(consoleErrorSpy).toBeCalledWith(mockError);
        });

        it("should call the underlying local storage setItem method", () => {
          expect(setItem).toBeCalledTimes(1);
          expect(setItem).toBeCalledWith(
            mockStorageKey,
            JSON.stringify(mockStorageValue)
          );
        });

        it("should update the hook's current value to the specified value", () => {
          expect(received.result.current[0]).toBe(mockStorageValue);
        });
      });

      describe("when called with a function", () => {
        beforeEach(() => {
          received = arrange();

          act(() => received.result.current[1](mockFunction));
        });

        it("should log an error message", () => {
          expect(consoleErrorSpy).toBeCalledTimes(1);
          expect(consoleErrorSpy).toBeCalledWith(mockError);
        });

        it("should call the underlying local storage setItem method", () => {
          expect(setItem).toBeCalledTimes(1);
          expect(setItem).toBeCalledWith(
            mockStorageKey,
            JSON.stringify(mockFunction(mockStorageValue))
          );
        });

        it("should should update the hook's current value to the function's return value", () => {
          expect(received.result.current[0]).toStrictEqual(
            mockFunction(mockStorageValue)
          );
        });
      });
    });
  });
});
