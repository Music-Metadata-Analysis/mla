const Events = {
  SuccessProfile: { category: "Profile", action: "Retrieved A User Profile" },
  ErrorProfile: {
    category: "Error",
    action: "Could Not Retrieve a User on Lastfm",
  },
  Search: { category: "Search", action: "Search for User Profile" },
  Contact: {
    category: "Contact",
    action: "Pressed contact button for external site.",
  },
  test: {
    category: "test",
    action: "test event was processed.",
  },
};

export default Events;
