import { act, renderHook } from "@testing-library/react";
import { useState } from "react";
import useNotOnMountEffect from "../not.on.mount.hook";

describe(useNotOnMountEffect.name, () => {
  let received: ReturnType<typeof arrange>;

  const onMountValue = null;
  const afterFirstRenderValue = 1;

  const mockSpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const useTestHook = () => {
    const [value, setValue] = useState<null | number>(onMountValue);

    useNotOnMountEffect(() => {
      mockSpy();
    }, [value]);

    return {
      value,
      setValue,
    };
  };

  const arrange = () => {
    return renderHook(() => useTestHook());
  };

  describe("when rendered", () => {
    beforeEach(() => (received = arrange()));

    describe("on the first render", () => {
      it(`should return an initial value of: '${onMountValue}'`, () => {
        expect(received.result.current.value).toBe(onMountValue);
      });

      it(`should not call the test hook's useEffect hook`, () => {
        expect(mockSpy).toHaveBeenCalledTimes(0);
      });

      describe("when the test hook sets a new value", () => {
        describe("on the second render", () => {
          beforeEach(
            async () =>
              await act(
                async () =>
                  await received.result.current.setValue(afterFirstRenderValue)
              )
          );

          it(`should return a final value of: '${afterFirstRenderValue}'`, () => {
            expect(received.result.current.value).toBe(afterFirstRenderValue);
          });

          it(`should execute the test hook's useEffect hook`, () => {
            expect(mockSpy).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});
