import type { MouseEventHandler } from "react";

interface AnalyticsGenericWrapperProps {
  clickHandler: MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}

const AnalyticsGenericWrapper = ({
  clickHandler,
  children,
}: AnalyticsGenericWrapperProps) => {
  return <div onClick={clickHandler}>{children}</div>;
};

export default AnalyticsGenericWrapper;
