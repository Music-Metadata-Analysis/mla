interface ConditionalProps {
  isTrue: boolean;
  children: JSX.Element;
}

const Condition = ({ isTrue, children }: ConditionalProps) => {
  if (isTrue) return children;
  return null;
};

export default Condition;
