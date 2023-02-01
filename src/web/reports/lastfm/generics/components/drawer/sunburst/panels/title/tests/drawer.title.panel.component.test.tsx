import { Container, Text } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import SunBurstDrawerTitlePanel, {
  SunBurstDrawerTitlePanelProps,
} from "../drawer.title.panel.component";
import { testIDs } from "../drawer.title.panel.identifiers";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Container", "Text"])
);

describe("SunBurstDrawerTitlePanel", () => {
  const currentProps: SunBurstDrawerTitlePanelProps = {
    titleText: "mockTitleText",
    subTitleText: "mockSubTitleText",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<SunBurstDrawerTitlePanel {...currentProps} />);
  };

  const checkChakraContainerProps = () => {
    it("should render the chakra Container component with the expected props", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(
        Container,
        {
          m: 0,
          p: 0,
          w: "80%",
          overflowWrap: "anywhere",
        },
        0,
        []
      );
    });
  };

  const checkChakraTextProps = () => {
    it("should render the chakra Text component with the expected props", () => {
      expect(Text).toBeCalledTimes(2);
      checkMockCall(
        Text,
        {
          "data-testid": testIDs.LastFMSunBurstDrawerTitle,
          fontSize: "md",
        },
        0,
        []
      );
      checkMockCall(
        Text,
        {
          "data-testid": testIDs.LastFMSunBurstDrawerSubTitle,
          fontSize: "sm",
        },
        1,
        []
      );
    });
  };

  const checkTextContent = () => {
    it("should render the drawer title as expected", async () => {
      const container = await screen.findByTestId(
        testIDs.LastFMSunBurstDrawerTitle
      );
      expect(
        await within(container).findByText(currentProps.titleText)
      ).toBeTruthy();
    });

    it("should render the drawer sub-title as expected", async () => {
      const container = await screen.findByTestId(
        testIDs.LastFMSunBurstDrawerSubTitle
      );
      expect(
        await within(container).findByText(currentProps.subTitleText)
      ).toBeTruthy();
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    checkChakraContainerProps();
    checkChakraTextProps();
    checkTextContent();
  });
});
