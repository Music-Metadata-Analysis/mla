import { Box, Flex, Avatar } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import UserNameFormContainer from "../forms/username/username.form.container";
import Search from "../search.component";
import Authentication from "@src/components/authentication/authentication.container";
import BillboardContainer from "@src/components/billboard/billboard.base/billboard.container";
import LastFMIconContainer from "@src/components/icons/lastfm/lastfm.icon.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Avatar", "Box", "Flex"])
);

jest.mock("@src/components/authentication/authentication.container", () =>
  require("@fixtures/react/child").createComponent(
    "MockedAuthenticationComponent"
  )
);

jest.mock("@src/components/billboard/billboard.base/billboard.container", () =>
  require("@fixtures/react/parent").createComponent("BillBoardContainer")
);

jest.mock("../forms/username/username.form.container.tsx", () =>
  require("@fixtures/react/parent").createComponent("UsernameFormContainer")
);

jest.mock("@src/components/icons/lastfm/lastfm.icon.container", () =>
  require("@fixtures/react/parent").createComponent("LastFMIconContainer")
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
      expect(Authentication).toBeCalledTimes(1);
      checkMockCall(Authentication, {});
    });

    it("should render the BillboardContainer component with the correct props", () => {
      expect(BillboardContainer).toBeCalledTimes(1);
      checkMockCall(BillboardContainer, { titleText: mockTitleText }, 0, []);
    });

    it("should render the chakra Flex component with the correct props", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(Flex, {
        align: "center",
        justify: "space-evenly",
        w: "100%",
      });
    });

    it("should render the chakra Box component with the correct props", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(Box, {}, 0, []);
      checkMockCall(Box, { pl: 5 }, 1, []);
    });

    it("should render the Avatar component with the correct props", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = jest.mocked(Avatar).mock.calls[0][0];
      expect(call.width).toStrictEqual([50, 50, 75]);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(renderToString(call.icon!)).toBe(
        renderToString(<LastFMIconContainer />)
      );
      expect(Object.keys(call).length).toBe(2);
    });

    it("should render the UsernameFormContainer component with the correct props", () => {
      expect(UserNameFormContainer).toBeCalledTimes(1);
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
