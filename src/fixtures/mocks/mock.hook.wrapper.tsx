import type { ReactNode } from "react";

export function createHookWrapper<T>(
  Wrapper: (arg0: T) => JSX.Element,
  props: T
) {
  return function CreatedWrapper({ children }: { children: ReactNode }) {
    return <Wrapper {...props}>{children}</Wrapper>;
  };
}
