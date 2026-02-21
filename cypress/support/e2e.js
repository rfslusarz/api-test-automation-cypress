require("./apiClient");
require("./validations");
require("./commands");

Cypress.on("uncaught:exception", () => {
    return false;
});