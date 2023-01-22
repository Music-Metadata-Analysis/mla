import type { MouseEventHandler } from "react";

interface AnalyticsExternalLinkWrapperProps {
  clickHandler: MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}

const AnalyticsExternalLinkWrapper = ({
  clickHandler,
  children,
}: AnalyticsExternalLinkWrapperProps) => {
  return <div onClick={clickHandler}>{children}</div>;
};

export default AnalyticsExternalLinkWrapper;
