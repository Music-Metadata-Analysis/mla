const cookiePrefix =
  Cypress.env("BASEURL") == "http://localhost:3000" ? "" : "__Secure-";

export const getAuthorizationCookieName = () => {
  const authorizationCookieName = cookiePrefix + "next-auth.session-token";
  return authorizationCookieName;
};
