const { defineConfig } = require("cypress");

module.exports = defineConfig({  
  component: {
    componentFolder: "./",
  },  
  e2e: {    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    testIsolation: false,
  },  
});
