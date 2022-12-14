import CheerioArtistImageScraper from "../cheerio";
import lastFMConfig from "@src/config/lastfm";

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

const mockInvalidHTML = "Invalid HTML";

describe("CheerioArtistImageScraper", () => {
  let instance: CheerioArtistImageScraper;
  let fetchSpy: jest.SpyInstance;
  let response: Promise<string>;

  let mockArtistName: string | undefined;

  const mockResponse = jest.fn();
  const retries = 2;

  beforeAll(() => {
    fetchSpy = jest.spyOn(window, "fetch");
  });

  afterAll(() => {
    fetchSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const setupFetch = ({
    success,
    status,
  }: {
    success: boolean;
    status: number;
  }) => {
    jest.mocked(window.fetch).mockResolvedValue({
      status,
      ok: success,
      text: mockResponse,
    } as unknown as Response);
  };

  const arrange = () => {
    instance = new CheerioArtistImageScraper();
  };

  describe("when artistName is valid", () => {
    let expectedURL: string;

    beforeEach(() => {
      mockArtistName = "God Is An Astronaut";
      expectedURL =
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

        describe("scrape", () => {
          beforeEach(() => {
            response = instance.scrape(mockArtistName, retries);
          });

          it("should call fetch with the correct params", () => {
            expect(fetch).toBeCalledTimes(1);
            expect(fetch).toBeCalledWith(expectedURL);
          });

          it("should return a promise containing the expected content", async () => {
            expect(await response).toBe(
              "https://lastfm.freetls.fastly.net/i/u/avatar170s/82133e6c8c384693c6596d69efcf786f"
            );
          });
        });
      });

      describe("when the response contains INVALID HTML", () => {
        beforeEach(() => {
          mockResponse.mockImplementation(() => mockInvalidHTML);
        });

        describe("scrape", () => {
          beforeEach(() => {
            response = instance.scrape(mockArtistName, retries);
          });

          it("should call fetch recursively on each retry with the correct params", () => {
            expect(fetch).toBeCalledTimes(retries + 1);
            expect(fetch).toHaveBeenNthCalledWith(1, expectedURL);
            expect(fetch).toHaveBeenNthCalledWith(2, expectedURL);
            expect(fetch).toHaveBeenNthCalledWith(3, expectedURL);
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

        describe("scrape", () => {
          beforeEach(() => {
            response = instance.scrape(mockArtistName, retries);
          });

          it("should call fetch recursively on each retry with the correct params", () => {
            expect(fetch).toBeCalledTimes(1);
            expect(fetch).toBeCalledWith(expectedURL);
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

      describe("scrape", () => {
        beforeEach(() => {
          response = instance.scrape(mockArtistName, retries);
        });

        it("should call fetch recursively on each retry with the correct params", () => {
          expect(fetch).toBeCalledTimes(retries + 1);
          expect(fetch).toHaveBeenNthCalledWith(1, expectedURL);
          expect(fetch).toHaveBeenNthCalledWith(2, expectedURL);
          expect(fetch).toHaveBeenNthCalledWith(3, expectedURL);
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

    describe("scrape", () => {
      beforeEach(() => {
        response = instance.scrape(mockArtistName, 2);
      });

      it("should NOT call fetch", () => {
        expect(fetch).toBeCalledTimes(0);
      });

      it("should return a promise containing the expected content", async () => {
        expect(await response).toBe(instance.defaultArtistImageResponse);
      });
    });
  });
});
