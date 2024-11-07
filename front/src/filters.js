import React from "react";
import { MemoryRouter } from "react-router-dom";
import Register from "../../src/pages/Register";

describe("Test User Registration", () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  });

  it("Should display the registration form", () => {
    cy.get('[data-cy="form"]').should("exist");
  });

  it("Should show validation errors when the form is submitted with empty fields", () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="email-error"]').should("exist");
    cy.get('[data-cy="password-error"]').should("exist");
  });

  it("Should allow a user to type into the input fields", () => {
    cy.get('[data-cy="name-input"]')
      .type("Joe Doe")
      .should("have.value", "Joe Doe");
    cy.get('[data-cy="email-input"]')
      .type("joe.doe@example.com")
      .should("have.value", "joe.doe@example.com");
    cy.get('[data-cy="password-input"]')
      .type("password123")
      .should("have.value", "password123");
  });

  it("Should handle form submission successfully", () => {
    cy.intercept("POST", "register", {
      statusCode: 200,
      body: { success: true },
    }).as("register");

    cy.get('[data-cy="name-input"]').type("Joe Doe");
    cy.get('[data-cy="email-input"]').type("joe.doe@example.com");
    cy.get('[data-cy="password-input"]').type("password123");
    cy.get('[data-cy="submit-button"]').click();

    cy.wait("@register").its("response.statsuCode").should("eq", 200);
  });

  it("Should handle server validation errors", () => {
    cy.intercept("POST", "register", {
      statusCode: 400,
      body: { errors: [{ msg: "Email already exists" }] },
    }).as("register");

    cy.get('[data-cy="name-input"]').type("Joe Doe");
    cy.get('[data-cy="email-input"]').type("joe.doe@example.com");
    cy.get('[data-cy="password-input"]').type("password123");
    cy.get('[data-cy="submit-button"]').click();

    cy.log("Waiting for the register route");

    cy.wait(
      "@register".then((interception) => {
        assert.isNotNull(
          interception.response.body,
          "Register route was intercepted"
        );
      })
    );
    cy.get("@register").its("response.statusCode").should("eq", 400);
    cy.get('[data-cy="server-error-0"]').should(
      "contain.text",
      "Email already exists"
    );
  });
});
