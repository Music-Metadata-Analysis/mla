import { render, screen } from "@testing-library/react";
import UserInterfaceChakraProvider from "../ui.chakra/ui.chakra.provider";
import UserInterfaceImagesProvider from "../ui.images/ui.images.provider";
import UserInterfacePopUpsProvider from "../ui.popups/ui.popups.provider";
import UserInterfaceRootProvider from "../ui.root.provider";
import BackGround from "@src/components/background/background.component";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/components/background/background.component", () =>
  require("@fixtures/react/parent").createComponent("BackGround")
);

jest.mock("../ui.chakra/ui.chakra.provider", () =>
  require("@fixtures/react/parent").createComponent(
    "UserInterfaceChakraProvider"
  )
);

jest.mock("../ui.popups/ui.popups.provider", () =>
  require("@fixtures/react/parent").createComponent(
    "UserInterfacePopUpsProvider"
  )
);

jest.mock("../ui.images/ui.images.provider", () =>
  require("@fixtures/react/parent").createComponent(
    "UserInterfaceImagesProvider"
  )
);

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

    it("should call UserInterfacePopupProvider with the correct props", () => {
      expect(UserInterfacePopUpsProvider).toBeCalledTimes(1);
      checkMockCall(UserInterfacePopUpsProvider, {});
    });

    it("should call UserInterfaceImagesProvider with the correct props", () => {
      expect(UserInterfaceImagesProvider).toBeCalledTimes(1);
      checkMockCall(UserInterfaceImagesProvider, {});
    });

    it("should return the mock child component", async () => {
      expect(await screen.findByText(mockChildComponent)).toBeTruthy();
    });
  });
});
