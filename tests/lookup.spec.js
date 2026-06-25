import { test, expect, _electron as electron } from "@playwright/test";

test.describe("LOOKUP", () => {
  let electronApp;
  let page;

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
    const formatSelect = page.getByRole("combobox", { name: "format" });
    const fieldSelect = page.getByRole("combobox", { name: "field" });
    await formatSelect.selectOption("");
    await fieldSelect.selectOption("");

    await expect(formatSelect).toHaveValue("");
    await expect(fieldSelect).toHaveValue("");
  });

  test("Selecting RECORDS as format loads the correct options in the field dropdown", async () => {
    const formatSelect = page.getByRole("combobox", { name: "format" });
    const fieldSelect = page.getByRole("combobox", { name: "field" });
    const fakeOption = page.getByRole("option", { name: "UNICORN" });

    await formatSelect.selectOption("records");

    const options = fieldSelect.getByRole("option");

    await expect(formatSelect).toBeVisible();
    await expect(fieldSelect).toBeVisible();
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
    await expect(fakeOption).toBeHidden();
  });

  test.skip("Selecting TAPES as format loads the correct options in the field dropdown", async () => {});
  test.skip("Selecting CDS MAIN as format loads the correct options in the field dropdown", async () => {});
  test.skip("Selecting CD COMPILATIONS as format loads the correct options in the field dropdown", async () => {});
  test.skip("Selecting CD SINGLES as format loads the correct options in the field dropdown", async () => {});
  test.skip("Selecting ALL FORMATS as format loads the correct options in the field dropdown", async () => {});

  test.skip("Displays error msg if no field is selected and search btn clicked.", async () => {});
  test.skip("When field is year or any id type, search input shows error msg if given non number value.", async () => {});
  test.skip("When field is year, search input shows error msg if year < 1886 or year > current year.", async () => {});
  test.skip("When field is sleeve or record condition, shows error msg if non * character is the value.", async () => {});
  test.skip("When field is needs_repair, shows error if search term is not 'y', 'yes', 'n' or 'no'.", async () => {});

  test.skip("Shows error message if there are no results.", async () => {});
  test.skip("Shows all items when no search term is entered and search btn is clicked.", async () => {});
  test.skip("Shows items containing the search term.", async () => {});
  test.skip("WRITE MORE TESTS HERE.", async () => {});
});
