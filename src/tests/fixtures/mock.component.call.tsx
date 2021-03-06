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
  component: React.FC<AnyProps> | React.ComponentClass<AnyProps, AnyProps>,
  props: Record<string, unknown>,
  index = 0,
  functions: string[] = ["onClick"],
  styled = false
) => {
  let call = { ...(component as jest.Mock).mock.calls[index][0] };
  if ("children" in call) delete call.children;
  if (styled && call.className) delete call.className;
  functions.forEach((functionName) => {
    call = isFunction(call, functionName);
  });
  expect(call).toStrictEqual(props);
};

export default checkMockCall;
