import PersistantReducerFactory from "../web/hooks/persisted.reducer.hook.factory.class";
import PersistentStateFactory from "../web/hooks/persisted.state.hook.factory.class";

jest.mock("../web/hooks/persisted.reducer.hook.factory.class");
jest.mock("../web/hooks/persisted.state.hook.factory.class");

export const MockPersistantReducerFactory = PersistantReducerFactory;
export const MockPersistentStateFactory = PersistentStateFactory;
