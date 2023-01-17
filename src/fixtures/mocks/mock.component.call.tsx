// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = any;
type instancePair = { name: string; class: unknown };

const isFunction = (call: { [index: string]: () => void }, name: string) => {
  if (call[name]) {
    expect(typeof call[name]).toBe("function");
    delete call[name];
  }
  return call;
};

const isInstance = (
  call: { [index: string]: () => void },
  props: Record<string, unknown>,
  name: string,
  classObject: unknown
) => {
  if (call[name]) {
    expect(call[name]).toBeInstanceOf(classObject);
    expect(JSON.stringify(call[name])).toBe(JSON.stringify(props[name]));
    delete call[name];
    delete props[name];
  }
  return call;
};

const checkMockCall = (
  component: React.FC<AnyProps> | React.ComponentClass<AnyProps, AnyProps>,
  props: Record<string, unknown>,
  index = 0,
  functions: string[] = ["onClick"],
  styled = false,
  instances: instancePair[] = []
): void => {
  let call = { ...jest.mocked(component).mock.calls[index][0] };
  if ("children" in call) delete call.children;
  if (styled && call.className) delete call.className;
  functions.forEach((functionName) => {
    call = isFunction(call, functionName);
  });
  instances.forEach((pair) => {
    call = isInstance(call, props, pair.name, pair.class);
  });
  expect(call).toStrictEqual(props);
};

export default checkMockCall;
