import routes from "./routes";

const settings = {
  heightDuringInput: 350,
  menuConfig: {
    about: routes.about,
    search: routes.search.lastfm.top20albums,
  },
};

export default settings;
