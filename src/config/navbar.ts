import routes from "@src/config/routes";

const settings = {
  offset: 110,
  minimumHeightDuringInput: 190,
  menuConfig: {
    about: routes.about,
    search: routes.search.lastfm.selection,
  },
};

export default settings;
