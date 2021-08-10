// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = any;

const isFunction = (call: { [index: string]: () => void }, name: string) => {
  if (call[name]) {
    expect(typeof call[name]).toBe("function");
    delete call[name];
  }
  return call;
};

const checkMockCall = (
  component: React.FC<AnyProps>,
  props: Record<string, unknown>,
  functions: string[] = ["onClick"]
) => {
  let call = { ...(component as jest.Mock).mock.calls[0][0] };
  if (call.children) delete call.children;
  functions.forEach((functionName) => {
    call = isFunction(call, functionName);
  });
  expect(props).toStrictEqual(call);
};

export default checkMockCall;
