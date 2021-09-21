import useAnalytics from "../../../hooks/analytics";

interface AnalyticsWrapperProps {
  buttonName: string;
  children: React.ReactNode;
}

const AnalyticsWrapper = ({ buttonName, children }: AnalyticsWrapperProps) => {
  const analytics = useAnalytics();

  return (
    <div onClick={(e) => analytics.trackButtonClick(e, buttonName)}>
      {children}
    </div>
  );
};

export default AnalyticsWrapper;
