import { test, expect, _electron as electron } from "@playwright/test";

test.describe("LOOKUP", () => {
  let electronApp;
  let page;
  let formatSelect;
  let fieldSelect;
  let searchInput;
  let searchButton;

  test.beforeAll(async () => {
    // Launch the Electron application pointing to your main entry file (e.g., main.js)
    electronApp = await electron.launch({ args: ["./main.js"] });
    // Wait for the first BrowserWindow to open
    page = await electronApp.firstWindow();
    await page.getByRole("link", { name: "LOOKUP" }).click();
  });

  test.afterAll(async () => {
    // Close the app at the end of the test
    await electronApp.close();
  });

  test.beforeEach(async () => {
    await page.reload();

    formatSelect = page.getByRole("combobox", { name: "format" });
    fieldSelect = page.getByRole("combobox", { name: "field" });
    searchInput = page.locator("#query-term");
    searchButton = page.locator("#btn-lookup");
  });

  test("the inputs get rendered to the page", async () => {
    await expect(formatSelect).toBeVisible();
    await expect(fieldSelect).toBeVisible();
    await expect(searchInput).toBeVisible();
    await expect(searchButton).toBeVisible();
  });

  test("the inputs have the correct initial inert states", async () => {
    await expect(formatSelect).toBeEnabled();
    await expect(fieldSelect).toHaveAttribute("inert");
    await expect(searchInput).toHaveAttribute("inert");
    await expect(searchButton).toHaveAttribute("inert");
  });

  test("Selecting RECORDS as format loads the correct options in the field dropdown", async () => {
    await formatSelect.selectOption("records");
    const options = fieldSelect.getByRole("option");

    await expect(options).toHaveText([
      "",
      "ARTIST",
      "DIAMETER",
      "ID",
      "LABEL",
      "LOCATION",
      "RECORD CONDITION",
      "SLEEVE CONDITION",
      "TITLE",
      "YEAR",
    ]);
  });

  test("Selecting TAPES as format loads the correct options in the field dropdown", async () => {
    await formatSelect.selectOption("tapes");
    const options = fieldSelect.getByRole("option");

    await expect(options).toHaveText([
      "",
      "ARTIST",
      "ID",
      "LOCATION",
      "NEEDS REPAIR",
      "SPEED",
      "TITLE",
      "YEAR",
    ]);
  });

  test("Selecting CDS MAIN as format loads the correct options in the field dropdown", async () => {
    await formatSelect.selectOption("cds");
    const options = fieldSelect.getByRole("option");

    await expect(options).toHaveText(["", "ARTIST", "ID", "LOCATION", "TITLE"]);
  });

  test("Selecting CD COMPILATIONS as format loads the correct options in the field dropdown", async () => {
    await formatSelect.selectOption("cd-compilations");
    const options = fieldSelect.getByRole("option");

    await expect(options).toHaveText([
      "",
      "ARTIST",
      "LOCATION",
      "TITLE",
      "TITLE ID",
      "TRACK ID",
      "TRACK NAME",
      "YEAR",
    ]);
  });

  test("Selecting CD SINGLES as format loads the correct options in the field dropdown", async () => {
    await formatSelect.selectOption("cd-singles");
    const options = fieldSelect.getByRole("option");

    await expect(options).toHaveText([
      "",
      "ARTIST",
      "CASE TYPE",
      "SINGLE ID",
      "TITLE",
      "TRACK ID",
      "TRACK NAME",
      "YEAR",
    ]);
  });

  test("Selecting ALL FORMATS as format loads the correct options in the field dropdown", async () => {
    await formatSelect.selectOption("all-formats");
    const options = fieldSelect.getByRole("option");

    await expect(options).toHaveText(["", "ARTIST"]);
  });

  test.skip("Displays error msg if no field is selected and search btn clicked.", async () => {});
  test.skip("When field is year or any id type, search input shows error msg if given non number value.", async () => {});
  test.skip("When field is year, search input shows error msg if year < 1886 or year > current year.", async () => {});
  test.skip("When field is sleeve or record condition, shows error msg if non * character is the value.", async () => {});
  test.skip("When field is needs_repair, shows error if search term is not 'y', 'yes', 'n' or 'no'.", async () => {});

  test.skip("Shows error message if there are no results.", async () => {});
  test.skip("Shows all items when no search term is entered and search btn is clicked.", async () => {});
  test.skip("Shows items containing the search term.", async () => {});

  test.skip("The field input is disabled until a format is selected.", async () => {});
  test.skip("The search input is disabled until a field is selected.", async () => {});
  test.skip("WRITE MORE TESTS HERE.", async () => {});
});
