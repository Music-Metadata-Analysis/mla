import type { MouseEventHandler } from "react";

interface AnalyticsInternalLinkWrapperProps {
  clickHandler: MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}

const AnalyticsInternalLinkWrapper = ({
  clickHandler,
  children,
}: AnalyticsInternalLinkWrapperProps) => {
  return <div onClick={clickHandler}>{children}</div>;
};

export default AnalyticsInternalLinkWrapper;
