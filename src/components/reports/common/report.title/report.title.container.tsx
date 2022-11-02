import ReportTitle from "./report.title.component";
import Condition from "@src/components/condition/condition.component";

interface ReportTitleContainerProps {
  title: string;
  userName: string | null;
  size: number;
}

const ReportTitleContainer = ({
  size,
  title,
  userName,
}: ReportTitleContainerProps) => {
  return (
    <Condition isTrue={userName !== null}>
      <ReportTitle size={size} title={title} userName={String(userName)} />
    </Condition>
  );
};

export default ReportTitleContainer;
