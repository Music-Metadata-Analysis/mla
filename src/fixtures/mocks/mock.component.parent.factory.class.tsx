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
        children: React.ReactElement;
        "data-testid": string | undefined;
        isDisabled: boolean | undefined;
        onClick: (...args: unknown[]) => void | undefined;
        type?: "button";
      }) => {
        return (
          <div
            data-testid={props["data-testid"] ? props["data-testid"] : name}
            onClick={
              props["onClick"] && !props.isDisabled
                ? props["onClick"]
                : undefined
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
