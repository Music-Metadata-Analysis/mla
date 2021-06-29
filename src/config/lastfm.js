export const HomePage = "https://www.last.fm";

export const GenerateUserLink = (username) => {
  return `${HomePage}/user/${username}`;
};

export const endPoints = {
  apiRoot: "https://ws.audioscrobbler.com/2.0/",
};
