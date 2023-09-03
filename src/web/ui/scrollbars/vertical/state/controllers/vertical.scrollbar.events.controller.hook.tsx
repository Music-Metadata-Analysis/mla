import { useEffect, useRef } from "react";
import VerticalScrollBarEventHandlers from "./vertical.scrollbar.events.controller.utility.class";
import useScrollBarsController from "@src/web/ui/scrollbars/generics/state/controllers/scrollbars.controller.hook";
import type { RefObject } from "react";

export interface useVerticalScrollBarEventsControllerProps {
  scrollRef: RefObject<HTMLDivElement>;
}

const useVerticalScrollBarEventsController = ({
  scrollRef,
}: useVerticalScrollBarEventsControllerProps) => {
  const scrollbars = useScrollBarsController();
  const handlers = useRef(
    new VerticalScrollBarEventHandlers(scrollRef)
  ).current;

  useEffect(() => {
    const activeScrollBar = scrollbars.current();
    if (activeScrollBar) {
      handlers.activeScrollBar = activeScrollBar;
      handlers.registerHookHandlers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollbars]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollbars.add(scrollRef.current?.id);
      handlers.activeScrollBar = scrollRef.current?.id;
    }
    return () => {
      scrollbars.remove();
      handlers.unregisterAllHandlers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    mouseDownHandler: handlers.mouseDownHandler,
  };
};

export default useVerticalScrollBarEventsController;
