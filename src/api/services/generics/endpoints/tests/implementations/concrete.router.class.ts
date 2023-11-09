import APIRouterBase from "../../generic.router.base.class";

class ConcreteApiRouter extends APIRouterBase {
  public service = "Test Service";
  public route = "/test/route";

  public methods = {
    GET: null,
    POST: mockPostHandler,
    PUT: mockPutHandler,
  };
}

export default ConcreteApiRouter;

export const mockPostHandler = jest.fn((req, res) => res.status(301));
export const mockPutHandler = jest.fn((req, res) => res.status(302));
