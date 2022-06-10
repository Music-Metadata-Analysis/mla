export const getMockComponentProp = ({
  component,
  propName,
  call = 0,
}: {
  component: unknown;
  propName: string;
  call?: number;
}) => {
  return (component as jest.Mock).mock.calls[call][0][propName];
};

export const getMockComponentPropCount = ({
  component,
  call = 0,
}: {
  component: unknown;
  call?: number;
}) => {
  return Object.keys((component as jest.Mock).mock.calls[call][0]).length;
};

export const getMockProp = ({
  mock,
  propName,
  call = 0,
}: {
  mock: unknown;
  propName: string;
  call?: number;
}) => getMockComponentProp({ component: mock, propName, call });

export const getMockCall = ({
  mock,
  call = 0,
}: {
  mock: unknown;
  call?: number;
}) => (mock as jest.Mock).mock.calls[call][0];
