import interceptFilms from "../support/intercept/films.js";
import interceptKiki from "../support/intercept/kiki.js";
import interceptTotoro from "../support/intercept/totoro.js";
import interceptPeople from "../support/intercept/people.js";
import movieTitles from "../fixtures/movieTitles.json";

describe("Initial Layout", () => {
  it("Has a body with two children: header and main", () => {
    cy.get("body").within(() => {
      cy.get("header").should("exist");
      cy.get("main").should("exist");
    });
  });
  it("Has a header with an image and h1", () => {
    cy.get("header").should("exist");
    cy.get("header").within(() => {
      cy.get("img")
        .should("exist")
        .should("have.attr", "src")
        .should("include", "./images/ghibli-logo.png");
      cy.get("img").invoke("attr", "alt").should("eq", "Ghibli logo");
      cy.get("h1").should("exist").should("have.text", "Ghibli Review App");
    });
  });
  it("Has a main element, with 4 section elements inside", () => {
    cy.get("main").within(() => {
      cy.get("section").should("have.length", 5);
    });
  });

  it("Has a section element with a select element", () => {
    cy.get("section h2").contains("Select a movie");
    cy.get("section select")
      .should("exist")
      .within(() => {
        cy.get("option").should("exist").should("have.value", "");
      });
  });

  it("Has a section element with a form", () => {
    cy.get("section h2").contains("Add a review");
    cy.get("section form")
      .should("exist")
      .within(() => {
        cy.get("label")
          .should("exist")
          .invoke("attr", "for")
          .should("eq", "review");
        cy.get("input[type='text']")
          .should("exist")
          .invoke("attr", "id")
          .should("eq", "review");
        cy.get("input[type='submit']").should("exist");
      });
  });

  it("Has a section element with a div for movie details", () => {
    cy.get("section h2").contains("Movie details");
    cy.get("section div")
      .should("exist")
      .invoke("attr", "id")
      .should("eq", "display-info");
  });

  it("Has a section element with an id of `reviews` an h2, button and ul for reviews", () => {
    cy.get("#reviews").should("exist");
    cy.get("section h2").contains("Reviews");
    cy.get("section button").should("exist").contains("Reset Reviews");
    cy.get("section ul").should("exist");
  });

  it("Has a button with an id of reset-reviews and text Reset Reviews", () => {
    cy.get("#reset-reviews").should("exist");
    cy.get("#reset-reviews").contains("Reset Reviews");
  });

  it("Has a button with an id of show-people and text Show People", () => {
    cy.get("#show-people").should("exist");
    cy.get("#show-people").contains("Show People");
  });
});

describe("CSS features", () => {
  it("Has a body with a background of lavender and a font-family of monospace", () => {
    cy.get("body").should("have.css", "background-color", "rgb(230, 230, 250)");
    cy.get("body").should("have.css", "font-family", "monospace");
  });

  it("Displays none for reviews section, if the width of the screen is less than 500px", () => {
    cy.viewport(600, 600).then(() => {
      cy.get("#reviews").should("have.css", "display", "block");
    });
    cy.viewport(400, 400).then(() => {
      cy.get("#reviews").should("have.css", "display", "none");
    });
  });
});

describe("Select Menu", () => {
  before(() => {
    interceptFilms();
    cy.visit("/");
    cy.wait("@request");
  });

  it("Has a select box", () => {
    cy.get("select").should("exist");
  });
  it("Has a select box containing the title of each movie populated from the API", () => {
    cy.get("select > option").should("have.length", 23);
    cy.get("select > option").then((options) => {
      const actual = [...options]
        .map((o) => o.innerText)
        .filter((el) => el !== "");
      const expected = movieTitles;
      expect(actual.sort()).to.deep.eq(expected.sort());
    });
  });
});

describe("Movie Description", () => {
  before(() => {
    interceptFilms();
    cy.visit("/");
    cy.wait("@request");
  });
  it("Select an option to view movie information", () => {
    interceptTotoro();
    cy.get("select").select("My Neighbor Totoro");
    cy.contains("My Neighbor Totoro").should("exist");

    cy.contains("1988").should("exist");
    const description =
      "Two sisters move to the country with their father in order to be closer to their hospitalized mother, and discover the surrounding trees are inhabited by Totoros, magical spirits of the forest. When the youngest runs away from home, the older sister seeks help from the spirits to find her.";
    cy.contains(description).should("exist");
    // allow people to populate
    cy.wait(1000);
  });

  it("Changes the movie information", () => {
    interceptKiki();
    cy.get("select").select("Kiki's Delivery Service");
    cy.contains("Kiki's Delivery Service").should("exist");
    cy.contains("1989").should("exist");
    cy.contains("1988").should("not.exist");
    const description =
      "A young witch, on her mandatory year of independent life, finds fitting into a new community difficult while she supports herself by running an air courier service.";
    cy.contains(description).should("exist");
  });

  it("Has display-info section include correct count of children", () => {
    cy.get("#display-info").children().should("have.length", 3);
  });
});

describe("Add reviews", () => {
  it("Enter a review that displays on the page", () => {
    interceptTotoro();
    cy.get("select").select("My Neighbor Totoro");
    cy.get('form input[type="text"]')
      .type("This movie was great!  I loved the dance to grow the tree.")
      .get('form input[type="submit"]')
      .click();
    cy.get("li").then((items) => {
      const actual = items[0].innerHTML;

      const titlePattern =
        /.*(<strong>|<b>)My Neighbor Totoro.+(<\/strong>|<\/b>).*/g;
      const descriptionPattern =
        /This movie was great!  I loved the dance to grow the tree./g;
      expect(actual).to.match(titlePattern);
      expect(actual).to.match(descriptionPattern);
    });
  });

  it("Clears the input after successful form submission", () => {
    cy.get('form input[type="text"]').should("have.value", "");
  });

  it("Still shows previous reviews", () => {
    interceptKiki();
    cy.get("select").select("Kiki's Delivery Service");
    cy.get('form input[type="text"]')
      .type("This is my favoirte movie of all time.")
      .get('form input[type="submit"]')
      .click();
    cy.get("li").then((items) => {
      const actual = items[0].innerHTML;
      const titlePattern =
        /.*(<strong>|<b>)My Neighbor Totoro.+(<\/strong>|<\/b>).*/g;
      const descriptionPattern =
        /This movie was great!  I loved the dance to grow the tree./g;
      expect(actual).to.match(titlePattern);
      expect(actual).to.match(descriptionPattern);
    });
    cy.get("li").then((items) => {
      const actual = items[1].innerHTML;
      const titlePattern =
        /.*(<strong>|<b>)Kiki's Delivery Service.+(<\/strong>|<\/b>).*/g;
      const descriptionPattern = /This is my favoirte movie of all time./g;
      expect(actual).to.match(titlePattern);
      expect(actual).to.match(descriptionPattern);
    });
  });
});

describe("Reset reviews", () => {
  it("Has a functional Reset Reviews button that empties the content of the ul", () => {
    cy.get("#reset-reviews").click();
    cy.get("ul li").should("have.length", 0);
  });
});
let stub;

describe("Error handling for reviews", () => {
  it("Alerts if a user did not select a movie when creating a comment", () => {
    stub = cy.stub();
    cy.on("window:alert", stub);
    cy.get("select").select("");
    cy.get("input[type='text']").type("Yes! Best movie ever!");
    cy.get('input[type="submit"]')
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith("Please select a movie first");
      });
  });
  it("Should not remove user input if there is an error", () => {
    cy.get('input[type="text"]').should("have.value", "Yes! Best movie ever!");
  });
});

describe("Get people for a movie", () => {
  before(() => {
    interceptKiki();
    cy.get("select").select("Kiki's Delivery Service");
  });

  it("Generates an ordered list of people's names", () => {
    interceptPeople();
    cy.get("#show-people").click();
    cy.wait("@people");
    ["Kiki", "Jiji", "Osono", "Ursula", "Tombo", "Madame"].forEach((person) =>
      cy.contains(person)
    );
  });
});
