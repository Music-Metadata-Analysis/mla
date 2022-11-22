import type { MouseEventHandler } from "react";

interface AnalyticsWrapperProps {
  clickHandler: MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}

const AnalyticsButtonWrapper = ({
  clickHandler,
  children,
}: AnalyticsWrapperProps) => {
  return <div onClick={clickHandler}>{children}</div>;
};

export default AnalyticsButtonWrapper;
