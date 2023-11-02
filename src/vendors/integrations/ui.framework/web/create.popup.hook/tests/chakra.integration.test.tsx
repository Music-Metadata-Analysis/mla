import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import MockPopUpComponent, {
  testIDs,
  testColours,
} from "./implementations/concrete.popup.component";
import useChakraPopUp from "../chakra";
import { createSimpleComponent } from "@fixtures/react/simple";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";
import usePopUpsController from "@src/vendors/integrations/ui.framework/web/popups/controller/popups.controller.hook";
import PopUpsControllerProvider from "@src/vendors/integrations/ui.framework/web/popups/provider/popups.provider";

describe("useChakraPopUp", () => {
  const mockDataId = "mockDataId";
  const mockName = "FeedBack";
  const mockMessage = "mockMessage";

  const subComponent1ID = "SubComponent1";
  const subComponent1 = createSimpleComponent(subComponent1ID);

  beforeEach(() => jest.clearAllMocks());

  const PopUpHarness = () => {
    const popups = usePopUpsController();

    useChakraPopUp({
      component: MockPopUpComponent,
      name: mockName,
      message: mockMessage,
      subComponents: { one: subComponent1 },
    });

    return (
      <div onClick={() => popups.open(mockName)} data-testid={mockDataId} />
    );
  };

  const arrange = () => {
    render(
      <uiFrameworkVendor.core.Provider cookies={"chakra-ui-color-mode=dark;"}>
        <PopUpsControllerProvider popUps={[mockName]}>
          <PopUpHarness />
        </PopUpsControllerProvider>
      </uiFrameworkVendor.core.Provider>
    );
  };

  describe("when the test harness is rendered", () => {
    beforeEach(() => arrange());

    it("should render a controller div", async () => {
      expect(await screen.findByTestId(mockDataId)).toBeTruthy();
    });

    describe("when the controller div is clicked", () => {
      beforeEach(async () =>
        fireEvent.click(await screen.findByTestId(mockDataId))
      );

      it("should render the MockPopUp component", async () => {
        expect(
          await screen.findByTestId(testIDs.MockPopUpComponent)
        ).toBeTruthy();
      });

      it("should render the expected message content", async () => {
        expect(
          await within(
            await screen.findByTestId(testIDs.MockPopUpComponent)
          ).findByText(mockMessage)
        ).toBeTruthy();
      });

      it("should render the MockPopUp close button", async () => {
        expect(
          await screen.findByTestId(testIDs.MockPopUpComponentCloseButton)
        ).toBeTruthy();
      });

      it("should render the MockPopUp colour toggle button", async () => {
        expect(
          await screen.findByTestId(testIDs.MockPopUpComponentColourToggle)
        ).toBeTruthy();
      });

      it(`should have an initial colour value of ${testColours.dark}`, async () => {
        expect(
          await within(
            await screen.findByTestId(testIDs.MockPopUpComponentColourIndicator)
          ).findByText(testColours.dark)
        ).toBeTruthy();
      });

      it("should render the passed sub component", async () => {
        await waitFor(() => expect(subComponent1).toHaveBeenCalledTimes(1));
        expect(
          await within(
            await screen.findByTestId(testIDs.MockPopUpComponent)
          ).findByText(subComponent1ID)
        ).toBeTruthy();
        checkMockCall(subComponent1, {});
      });

      describe("when the MockPopUp's close button is clicked", () => {
        beforeEach(async () =>
          fireEvent.click(
            await screen.findByTestId(testIDs.MockPopUpComponentCloseButton)
          )
        );

        it("should close the MockPopUp component", async () => {
          await waitFor(() =>
            expect(screen.queryByText(testIDs.MockPopUpComponent)).toBeFalsy()
          );
        });

        describe("when the controller div is clicked", () => {
          beforeEach(async () =>
            fireEvent.click(await screen.findByTestId(mockDataId))
          );

          it("should render the MockPopUp component (again)", async () => {
            expect(
              await screen.findByTestId(testIDs.MockPopUpComponent)
            ).toBeTruthy();
          });
        });
      });

      describe("when the MockPopUp's colour toggle button is clicked", () => {
        beforeEach(async () =>
          fireEvent.click(
            await screen.findByTestId(testIDs.MockPopUpComponentColourToggle)
          )
        );

        it(`should change the colour indicator to read ${testColours.light}`, async () => {
          expect(
            await within(
              await screen.findByTestId(
                testIDs.MockPopUpComponentColourIndicator
              )
            ).findByText(testColours.light)
          ).toBeTruthy();
        });

        describe("when the MockPopUp's colour toggle button is clicked again", () => {
          beforeEach(async () =>
            fireEvent.click(
              await screen.findByTestId(testIDs.MockPopUpComponentColourToggle)
            )
          );

          it(`should change the colour indicator back to read ${testColours.dark}`, async () => {
            expect(
              await within(
                await screen.findByTestId(
                  testIDs.MockPopUpComponentColourIndicator
                )
              ).findByText(testColours.dark)
            ).toBeTruthy();
          });
        });
      });
    });

    describe("when the controller div is clicked multiple times", () => {
      beforeEach(async () => {
        fireEvent.click(await screen.findByTestId(mockDataId));
        fireEvent.click(await screen.findByTestId(mockDataId));
        fireEvent.click(await screen.findByTestId(mockDataId));
      });

      it("should NOT render multiple MockPopUp components", async () => {
        expect(
          (await screen.findAllByTestId(testIDs.MockPopUpComponent)).length
        ).toBe(1);
      });
    });
  });
});
