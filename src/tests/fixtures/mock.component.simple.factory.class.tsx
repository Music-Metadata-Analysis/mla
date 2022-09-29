class MockSimpleComponentFactory {
  create = (name: string) =>
    jest.fn(() => (
      <div data-testid={{ name }}>{name}</div>
    )) as () => JSX.Element;
}

export const createSimpleComponent = new MockSimpleComponentFactory().create;
