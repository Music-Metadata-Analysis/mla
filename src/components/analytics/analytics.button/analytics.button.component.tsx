import useAnalytics from "@src/hooks/analytics";

interface AnalyticsWrapperProps {
  buttonName: string;
  children: React.ReactNode;
}

const AnalyticsButtonWrapper = ({
  buttonName,
  children,
}: AnalyticsWrapperProps) => {
  const analytics = useAnalytics();

  return (
    <div onClick={(e) => analytics.trackButtonClick(e, buttonName)}>
      {children}
    </div>
  );
};

export default AnalyticsButtonWrapper;
