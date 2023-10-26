October, 2021.

# Features

There are 3 dynamically generated Top 20 charts you can interact with to see your Top Albums, Top Artists and Top Tracks.

There is also a rudimentary events engine in place, which collects usage metrics in local storage. This allows for me to display messages based on, for example, how many searches a user has performed- without involving a database at this stage.

The project leverages [next-i18next](https://www.npmjs.com/package/next-i18next) to handle translations and is multilingual ready. English is the only implemented language currently.

# Technologies Used

This is my first NextJS project, and the first substantive project I've done fully in TypeScript.

Interesting libraries that I used were:

- [@aws-sdk](https://www.npmjs.com/package/aws-sdk)
- [@chakra-ui/react](https://www.npmjs.com/package/@chakra-ui/react)
- [cheerio](https://www.npmjs.com/package/cheerio)
- [@toplast/lastfm](https://www.npmjs.com/package/@toplast/lastfm)
- [next-auth](https://www.npmjs.com/package/next-auth)

## Testing

It's worth noting that I made unit and integration testing a high priority during the course of development. I took a two pronged approach:

- First I created simple unit tests that checked the props of each underlying component call. This gave me "change protection" in the event that props were modified. I typically found myself prototyping the UI components first and then writing these tests.

- Secondly, higher level integration tests using [Testing Library](https://testing-library.com/) formed the remainder of the test suites, where interactions with the UI and backing services could be modelled and tested.

## Hurdles

I quickly found out that the [last.fm](https://last.fm) api had some restrictions on what was available in terms of Artist and Track artwork.

To overcome this I built a web scraper to collect the images required on demand, and store the urls in a S3 bucket with CloudFront caching. This has resulted in decent initial load times, with excellent subsequent load times.

The bucket itself is just storing a few bytes for each Artist, so the solution is scalable and cheap. The API keys used to access these AWS resources are available only to the backend serverless functions.

Netlify has a 10 second timeout for function execution which can sometimes be exceeded by the initial data scraping and cache loading. This turned out to be a non-issue, because even a half loaded cache would significantly speed up the request- allowing a simple retry mechanism to yield great results.

## Future Plans

If there is sufficient interest, I'd like to explore more interesting visuals using a library like [D3](https://d3js.org/). I've done this kind of thing before, where for example, one could see what percentage of your listens were by a specific Artist or Album.

I'd also like to introduce a second (possibly more widely used) data source: [Spotify](https://www.spotify.com/).
