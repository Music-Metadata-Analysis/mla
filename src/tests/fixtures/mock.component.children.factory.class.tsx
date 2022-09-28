class MockComponentWithChildrenFactory {
  create = (name: string, exportName = "default") => {
    const mockModule: { [index: string]: jest.Mock | string | boolean } = {
      __esModule: true,
    };
    mockModule[exportName] = jest.fn(
      ({
        children,
        ...props
      }: {
        "data-testid": string | undefined;
        onClick: (...args: unknown[]) => void | undefined;
        disabled: boolean | undefined;
        children: React.ReactChildren;
      }) => {
        return (
          <div
            data-testid={props["data-testid"] ? props["data-testid"] : name}
            onClick={
              props["onClick"] && !props.disabled ? props["onClick"] : undefined
            }
          >
            {children}
          </div>
        );
      }
    );
    return mockModule;
  };
}

export const createComponent = new MockComponentWithChildrenFactory().create;
