import {
  Avatar,
  Box,
  Container,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import translations from "../../../../public/locales/en/about.json";
import externalLinks from "../../../config/external";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import Billboard from "../../billboard/billboard.component";
import Button from "../../button/button.standard/button.standard.component";
import ClickLink from "../../clickable/click.external.link/click.external.link.component";
import SVSIcon from "../../icons/svs/svs.icon";
import DimOnHover from "../../styles/hover.dim/hover.dim.styles";
import About, { testIDs } from "../about.component";

jest.mock("../../billboard/billboard.component", () =>
  createMockedComponent("BillBoard")
);

jest.mock("../../button/button.standard/button.standard.component", () =>
  createMockedComponent("Button")
);

jest.mock(
  "../../clickable/click.external.link/click.external.link.component",
  () => createMockedComponent("ClickLink")
);

jest.mock("../../styles/hover.dim/hover.dim.styles", () =>
  createMockedComponent("DimOnHover")
);

jest.mock("../../highlight/highlight.component", () =>
  createMockedComponent("Highlight")
);

jest.mock("../../icons/svs/svs.icon", () => jest.fn(() => <div>MockIcon</div>));

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create([
    "Avatar",
    "Container",
    "Box",
    "ListItem",
    "Text",
    "UnorderedList",
  ]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("About", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<About />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Avatar as expected to display the logo", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = (Avatar as jest.Mock).mock.calls[0][0];
      expect(call.width).toStrictEqual([50, 50, 75]);
      expect(renderToString(call.icon)).toBe(
        renderToString(<SVSIcon width={75} height={75} />)
      );
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call Billboard with the correct props", () => {
      expect(Billboard).toBeCalledTimes(1);
      checkMockCall(Billboard, { title: translations.title });
    });

    it("should call Button with the correct props", () => {
      expect(Button).toBeCalledTimes(1);
      checkMockCall(Button, {
        analyticsName: "Splash Page Start",
        "data-testid": testIDs.AboutStartButton,
        mb: 2,
      });
    });

    it("should call ClickLink with the correct props", () => {
      expect(ClickLink).toBeCalledTimes(1);
      checkMockCall(ClickLink, { href: externalLinks.svs });
    });

    it("should call DimOnHover with the correct props", () => {
      expect(DimOnHover).toBeCalledTimes(1);
      checkMockCall(DimOnHover, {});
    });

    it("should call Box with the correct props", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(
        Box,
        {
          mb: 3,
        },
        0
      );
      checkMockCall(
        Box,
        {
          mb: [5, 5, 8],
        },
        1
      );
    });

    it("should call Container with the correct props", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(
        Container,
        {
          centerContent: true,
          pb: 5,
          pl: 5,
          pr: 5,
          ml: 2,
          fontSize: [12, 14, 14, "md"],
        },
        0
      );
    });

    it("should call ListItem with the correct props", () => {
      const expectedPadding = [0.5, 0.5, 0, 0];
      expect(ListItem).toBeCalledTimes(3);
      checkMockCall(
        ListItem,
        {
          p: expectedPadding,
        },
        0
      );
      checkMockCall(
        ListItem,
        {
          p: expectedPadding,
        },
        1
      );
      checkMockCall(
        ListItem,
        {
          p: expectedPadding,
        },
        2
      );
    });

    it("should call Text with the correct props", () => {
      expect(Text).toBeCalledTimes(2);
      checkMockCall(
        Text,
        {
          ml: 2,
          fontSize: ["xxs"],
        },
        0
      );
      checkMockCall(
        Text,
        {
          ml: 2,
          fontSize: ["l", "xl", "2xl"],
        },
        1
      );
    });

    it("should call UnorderedList with the correct props", () => {
      expect(UnorderedList).toBeCalledTimes(1);
      checkMockCall(UnorderedList, { "data-testid": testIDs.AboutList }, 0);
    });
  });
});
