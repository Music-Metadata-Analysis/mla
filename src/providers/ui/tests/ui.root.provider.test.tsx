import { render, screen } from "@testing-library/react";
import BackGround from "../../../components/background/background.component";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import UserInterfaceChakraProvider from "../ui.chakra/ui.chakra.provider";
import UserInterfaceRootProvider from "../ui.root.provider";

jest.mock("../../../components/background/background.component", () => {
  return createMockedComponent("BackGround");
});

jest.mock("../ui.chakra/ui.chakra.provider", () => {
  return createMockedComponent("UserInterfaceChakraProvider");
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("UserInterfaceRootProvider", () => {
  const mockChildComponent = "MockChildComponent";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <UserInterfaceRootProvider>
        <div>{mockChildComponent}</div>
      </UserInterfaceRootProvider>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call BackGround with the correct props", () => {
      expect(BackGround).toBeCalledTimes(1);
      checkMockCall(BackGround, {});
    });

    it("should call UserInterfaceChakraProvider with the correct props", () => {
      expect(UserInterfaceChakraProvider).toBeCalledTimes(1);
      checkMockCall(UserInterfaceChakraProvider, {});
    });

    it("should return the mock child component", async () => {
      expect(await screen.findByText(mockChildComponent)).toBeTruthy();
    });
  });
});
