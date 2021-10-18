export const GenerateUserLink = (username: string) => {
  return `${settings.homePage}/user/${username}`;
};

const settings = {
  apiRoot: "https://ws.audioscrobbler.com/2.0/",
  homePage: "https://www.last.fm",
  prefixPath: "https://www.last.fm/music",
  search: {
    fieldName: "username",
    maxUserLength: 60,
    minUserLength: 1,
  },
  select: {
    indicatorWidth: 625,
  },
};

export default settings;
