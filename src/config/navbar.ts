import routes from "./routes";

const MenuConfig = {
  about: routes.about,
  search: routes.search.lastfm.top20albums,
};

export const settings = {
  heightDuringInput: 350,
};

export default MenuConfig;
