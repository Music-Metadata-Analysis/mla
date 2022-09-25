import useAnalytics from "@src/hooks/analytics";

interface AnalyticsLinkWrapperProps {
  href: string;
  children: React.ReactNode;
}

const AnalyticsLinkWrapper = ({
  href,
  children,
}: AnalyticsLinkWrapperProps) => {
  const analytics = useAnalytics();

  return (
    <div onClick={(e) => analytics.trackInternalLinkClick(e, href)}>
      {children}
    </div>
  );
};

export default AnalyticsLinkWrapper;
