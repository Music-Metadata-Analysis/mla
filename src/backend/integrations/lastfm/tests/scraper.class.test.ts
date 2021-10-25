import lastFMConfig from "../../../../config/lastfm";
import Scraper from "../scraper.class";

const mockValidExpectedHTML = `
  <ul class="image-list">
      <li class="image-list-item-wrapper">
          <a href="/music/God+Is+an+Astronaut/+images/82133e6c8c384693c6596d69efcf786f" class="image-list-item">
              <img src="https://lastfm.freetls.fastly.net/i/u/avatar170s/82133e6c8c384693c6596d69efcf786f" alt="giaa2015" loading="lazy">
              <span class="image-list-item-preferred-container">
                  <span class="image-list-item-preferred-icon">
                      <span class="sr-only">Preferred image</span>
                  </span>
              </span>
          </a>
      </li>
    </ul>
`;

const mockValidUnexpectedHTML = `
  <ul class="image-list">
      <li class="image-list-item-wrapper">
          <a href="/music/God+Is+an+Astronaut/+images/82133e6c8c384693c6596d69efcf786f" class="image-list-item">
              <span class="image-list-item-preferred-container">
                  <span class="image-list-item-preferred-icon">
                      <span class="sr-only">Preferred image</span>
                  </span>
              </span>
          </a>
      </li>
    </ul>
`;

const mockInvalidHTML = `Invalid HTML`;

describe("Scraper", () => {
  let instance: Scraper;
  let response: Promise<string>;
  const mockResponse = jest.fn();
  let mockArtistName: string | undefined;
  const retries = 2;

  beforeAll(() => {
    jest.spyOn(window, "fetch");
  });

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  afterAll(() => jest.restoreAllMocks());

  const setupFetch = ({
    success,
    status,
  }: {
    success: boolean;
    status: number;
  }) => {
    (window.fetch as jest.Mock).mockResolvedValue({
      status,
      ok: success,
      text: mockResponse,
    });
  };

  const arrange = () => {
    instance = new Scraper();
  };

  describe("when artistName is valid", () => {
    let expectedCall: string;

    beforeEach(() => {
      mockArtistName = "God Is An Astronaut";
      expectedCall =
        lastFMConfig.prefixPath +
        "/" +
        encodeURIComponent(mockArtistName) +
        "/+images";
    });

    describe("when the response is successful", () => {
      beforeEach(() => {
        setupFetch({ success: true, status: 200 });
      });

      describe("when the response contains VALID HTML", () => {
        beforeEach(() => {
          mockResponse.mockImplementation(() => mockValidExpectedHTML);
        });

        describe("getArtistImage", () => {
          beforeEach(() => {
            response = instance.getArtistImage(mockArtistName, retries);
          });

          it("should call fetch with the correct params", () => {
            expect(fetch).toBeCalledTimes(1);
            expect(fetch).toBeCalledWith(expectedCall);
          });

          it("should return a promise containing the expected content", async () => {
            expect(await response).toBe(
              "https://lastfm.freetls.fastly.net/i/u/avatar170s/82133e6c8c384693c6596d69efcf786f"
            );
          });
        });
      });

      describe("when the response does contains INVALID HTML", () => {
        beforeEach(() => {
          mockResponse.mockImplementation(() => mockInvalidHTML);
        });

        describe("getArtistImage", () => {
          beforeEach(() => {
            response = instance.getArtistImage(mockArtistName, retries);
          });

          it("should call fetch recursively on each retry with the correct params", () => {
            expect(fetch).toBeCalledTimes(retries + 1);
            expect(fetch).toHaveBeenNthCalledWith(1, expectedCall);
            expect(fetch).toHaveBeenNthCalledWith(2, expectedCall);
            expect(fetch).toHaveBeenNthCalledWith(3, expectedCall);
          });

          it("should return a promise containing the expected content", async () => {
            expect(await response).toBe(instance.defaultArtistImageResponse);
          });
        });
      });

      describe("when the response contains VALID but UNEXPECTED HTML", () => {
        beforeEach(() => {
          mockResponse.mockImplementation(() => mockValidUnexpectedHTML);
        });

        describe("getArtistImage", () => {
          beforeEach(() => {
            response = instance.getArtistImage(mockArtistName, retries);
          });

          it("should call fetch recursively on each retry with the correct params", () => {
            expect(fetch).toBeCalledTimes(1);
            expect(fetch).toBeCalledWith(expectedCall);
          });

          it("should return a promise containing the expected content", async () => {
            expect(await response).toBe(instance.defaultArtistImageResponse);
          });
        });
      });
    });

    describe("when the response is unsuccessful", () => {
      beforeEach(() => {
        setupFetch({ success: false, status: 400 });
      });

      describe("getArtistImage", () => {
        beforeEach(() => {
          response = instance.getArtistImage(mockArtistName, retries);
        });

        it("should call fetch recursively on each retry with the correct params", () => {
          expect(fetch).toBeCalledTimes(retries + 1);
          expect(fetch).toHaveBeenNthCalledWith(1, expectedCall);
          expect(fetch).toHaveBeenNthCalledWith(2, expectedCall);
          expect(fetch).toHaveBeenNthCalledWith(3, expectedCall);
        });

        it("should return a promise containing the expected content", async () => {
          expect(await response).toBe(instance.defaultArtistImageResponse);
        });
      });
    });
  });

  describe("when artistName is invalid", () => {
    beforeEach(() => {
      mockArtistName = undefined;
    });

    describe("getArtistImage", () => {
      beforeEach(() => {
        response = instance.getArtistImage(mockArtistName, 2);
      });

      it("should return a promise containing the expected content", async () => {
        expect(await response).toBe(instance.defaultArtistImageResponse);
      });
    });
  });
});
