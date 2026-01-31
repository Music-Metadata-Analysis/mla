import { Box, Flex, Avatar } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import Search from "../search.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import Authentication from "@src/web/authentication/sign.in/components/authentication.container";
import UserNameFormContainer from "@src/web/forms/lastfm/components/username/username.form.container";
import BillboardContainer from "@src/web/ui/generics/components/billboard/billboard.base/billboard.container";
import LastFMIconContainer from "@src/web/ui/generics/components/icons/lastfm/lastfm.icon.container";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Avatar", "Box", "Flex"])
);

jest.mock(
  "@src/web/authentication/sign.in/components/authentication.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "MockedAuthenticationComponent"
    )
);

jest.mock(
  "@src/web/ui/generics/components/billboard/billboard.base/billboard.container",
  () => require("@fixtures/react/parent").createComponent("BillBoardContainer")
);

jest.mock(
  "@src/web/forms/lastfm/components/username/username.form.container",
  () =>
    require("@fixtures/react/parent").createComponent("UsernameFormContainer")
);

jest.mock(
  "@src/web/ui/generics/components/icons/lastfm/lastfm.icon.container",
  () => require("@fixtures/react/parent").createComponent("LastFMIconContainer")
);

describe("Search", () => {
  const mockTitleText = "mockTitleText";
  const mockRoute = "/some/fancy/route/here";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<Search route={mockRoute} titleText={mockTitleText} />);
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should render the Authentication component with the correct props", () => {
      expect(Authentication).toHaveBeenCalledTimes(1);
      checkMockCall(Authentication, {});
    });

    it("should render the BillboardContainer component with the correct props", () => {
      expect(BillboardContainer).toHaveBeenCalledTimes(1);
      checkMockCall(BillboardContainer, { titleText: mockTitleText }, 0, []);
    });

    it("should render the chakra Flex component with the correct props", () => {
      expect(Flex).toHaveBeenCalledTimes(1);
      checkMockCall(Flex, {
        align: "center",
        justify: "space-evenly",
        w: "100%",
      });
    });

    it("should render the chakra Box component with the correct props", () => {
      expect(Box).toHaveBeenCalledTimes(2);
      checkMockCall(Box, {}, 0, []);
      checkMockCall(Box, { pl: 5 }, 1, []);
    });

    it("should render the Avatar component with the correct props", () => {
      expect(Avatar).toHaveBeenCalledTimes(1);
      const call = jest.mocked(Avatar).mock.calls[0][0];
      expect(call.height).toStrictEqual([50, 50, 75]);
      expect(call.width).toStrictEqual([50, 50, 75]);
      expect(renderToString(call.icon!)).toBe(
        renderToString(<LastFMIconContainer />)
      );
      expect(Object.keys(call).length).toBe(3);
    });

    it("should render the UsernameFormContainer component with the correct props", () => {
      expect(UserNameFormContainer).toHaveBeenCalledTimes(1);
      checkMockCall(
        UserNameFormContainer,
        {
          route: mockRoute,
        },
        0
      );
    });
  });
});
