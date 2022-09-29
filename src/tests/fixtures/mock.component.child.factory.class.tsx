class MockComponentFactory {
  create = (
    name: string,
    exportName = "default",
    otherProps?: Record<string, unknown>
  ) => {
    const mockModule: { [index: string]: jest.Mock | string | boolean } = {
      __esModule: true,
    };
    mockModule[exportName] = jest.fn(
      ({
        ...props
      }: {
        "data-testid": string | undefined;
        onClick: (...args: unknown[]) => void | undefined;
        disabled: boolean | undefined;
      }) => {
        return (
          <div
            data-testid={props["data-testid"] ? props["data-testid"] : name}
            onClick={
              props["onClick"] && !props.disabled ? props["onClick"] : undefined
            }
            {...otherProps}
          >
            {name}
          </div>
        );
      }
    );
    return mockModule;
  };
}

export const createComponent = new MockComponentFactory().create;
