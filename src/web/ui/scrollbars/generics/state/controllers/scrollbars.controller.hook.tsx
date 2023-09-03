import { useContext, useCallback } from "react";
import { ScrollBarsControllerContext } from "@src/web/ui/scrollbars/generics/state/providers/scrollbars.provider";

const useScrollBarsController = () => {
  const scrollbars = useContext(ScrollBarsControllerContext);

  const add = (scrollbar: string | undefined) => {
    if (scrollbar) {
      scrollbars.setStack((stack) => {
        if (!stack.includes(scrollbar)) return stack.concat([scrollbar]);
        return stack;
      });
    }
  };

  const current = useCallback(
    () => scrollbars.stack[scrollbars.stack.length - 1],
    [scrollbars.stack]
  );

  const remove = () =>
    scrollbars.setStack((stack) => stack.slice(0, stack.length - 1));

  return {
    add,
    current,
    remove,
  };
};

export default useScrollBarsController;

export type ScrollBarsControllerHookType = ReturnType<
  typeof useScrollBarsController
>;
