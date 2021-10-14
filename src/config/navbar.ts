import routes from "./routes";

const settings = {
  heightDuringInput: 350,
  menuConfig: {
    about: routes.about,
    search: routes.search.lastfm.selection,
  },
};

export default settings;
