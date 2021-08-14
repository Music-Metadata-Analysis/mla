export const HomePage = "https://www.last.fm";

export const GenerateUserLink = (username: string) => {
  return `${HomePage}/user/${username}`;
};

export const endPoints = {
  apiRoot: "https://ws.audioscrobbler.com/2.0/",
};

const settings = {
  search: {
    fieldName: "username",
    maxUserLength: 60,
    minUserLength: 1,
  },
};

export default settings;
