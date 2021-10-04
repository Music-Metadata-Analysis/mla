import useAnalytics from "../../../hooks/analytics";

interface AnalyticsWrapperProps {
  href: string;
  children: React.ReactNode;
}

const LinkAnalyticsWrapper = ({ href, children }: AnalyticsWrapperProps) => {
  const analytics = useAnalytics();

  return (
    <div onClick={(e) => analytics.trackExternalLinkClick(e, href)}>
      {children}
    </div>
  );
};

export default LinkAnalyticsWrapper;
