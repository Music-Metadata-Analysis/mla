// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = any;

export const getMockComponentProp = ({
  component,
  propName,
  call = 0,
}: {
  component: React.FC<AnyProps> | React.ComponentClass<AnyProps, AnyProps>;
  propName: string;
  call?: number;
}) => {
  return jest.mocked(component).mock.calls[call][0][propName];
};

export const getMockComponentPropCount = ({
  component,
  call = 0,
}: {
  component: React.FC<AnyProps> | React.ComponentClass<AnyProps, AnyProps>;
  call?: number;
}) => {
  return Object.keys(jest.mocked(component).mock.calls[call][0]).length;
};

export const getMockProp = ({
  mock,
  propName,
  call = 0,
}: {
  mock: jest.Mock<unknown>;
  propName: string;
  call?: number;
}) => mock.mock.calls[call][0][propName];
