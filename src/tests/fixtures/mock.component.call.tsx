// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = any;

const checkMockCall = (
  component: React.FC<AnyProps>,
  props: Record<string, unknown>
) => {
  const call = { ...(component as jest.Mock).mock.calls[0][0] };
  if (call.children) delete call.children;
  if (call.onClick) {
    expect(typeof call.onClick).toBe("function");
    delete call.onClick;
  }
  expect(props).toStrictEqual(call);
};

export default checkMockCall;
