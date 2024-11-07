import React from "react";
import { MemoryRouter } from "react-router-dom";
import Register from "../../src/pages/Register";

describe("Test User Registration Page", () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  });

  it("Should display the registration form", () => {
    cy.get('[data-cy="form"]'.should("exist"));
  });
});
