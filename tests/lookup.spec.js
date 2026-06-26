import { test, expect, _electron as electron } from "@playwright/test";

test.describe("LOOKUP", () => {
  let electronApp;
  let page;
  let formatSelect;
  let fieldSelect;
  let searchInput;
  let searchButton;
  let resultsDiv;
  const numValidationMsg =
    "Please enter a valid number to search by that field.";
  const yearRangeMsg =
    "Please enter a valid 4 digit year between 1885 and the current year.";
  const recCondValidationMsg = "Please enter 1-5 *'s to search by condition.";
  const needsRepairValidationMsg =
    "For that field, term must be yes(y) or no(n).";

  test.beforeAll(async () => {
    // Launch the Electron application pointing to your main entry file (e.g., main.js)
    electronApp = await electron.launch({
      args: ["./main.js"],
      env: {
        ...process.env,
        DB_NAME: "test_music_catalog",
      },
    });

    // Catch anything Electron tries to log to the terminal and route it to Playwright's terminal
    electronApp.process().stdout.on("data", (data) => {
      console.log(`Electron Main STDOUT: ${data.toString()}`);
    });

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
    resultsDiv = page.locator("#query-results");
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

  test("When field is year, shows error msg if given non number value to search for.", async () => {
    await formatSelect.selectOption("records");
    await fieldSelect.selectOption("year");
    await searchInput.fill("Unicorn");
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(numValidationMsg);
  });

  test("When field is id, shows error msg if given non number value to search for.", async () => {
    await formatSelect.selectOption("tapes");
    await fieldSelect.selectOption("id");
    await searchInput.fill("Unicorn");
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(numValidationMsg);
  });

  test("When field is title id, shows error msg if given non number value to search for.", async () => {
    await formatSelect.selectOption("cd-compilations");
    await fieldSelect.selectOption("title_id");
    await searchInput.fill("Unicorn");
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(numValidationMsg);
  });

  test("When field is single id, shows error msg if given non number value to search for.", async () => {
    await formatSelect.selectOption("cd-singles");
    await fieldSelect.selectOption("single_id");
    await searchInput.fill("Unicorn");
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(numValidationMsg);
  });

  test("When field is track id, shows error msg if given non number value to search for.", async () => {
    await formatSelect.selectOption("cd-singles");
    await fieldSelect.selectOption("track_id");
    await searchInput.fill("Unicorn");
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(numValidationMsg);
  });

  test("When field is year, search input shows error msg if year < 1886.", async () => {
    await formatSelect.selectOption("records");
    await fieldSelect.selectOption("year");
    await searchInput.fill("1847");
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(yearRangeMsg);
  });

  test("When field is year, search input shows error msg if year > current year.", async () => {
    await formatSelect.selectOption("records");
    await fieldSelect.selectOption("year");
    await searchInput.fill("2100");
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(yearRangeMsg);
  });

  test("When field is sleeve condition, shows error msg if non * character is the value.", async () => {
    await formatSelect.selectOption("records");
    await fieldSelect.selectOption("sleeve_condition");
    await searchInput.fill("Unicorn");
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(recCondValidationMsg);
  });

  test("When field is record condition, shows error msg if non * character is the value.", async () => {
    await formatSelect.selectOption("records");
    await fieldSelect.selectOption("record_condition");
    await searchInput.fill("Unicorn");
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(recCondValidationMsg);
  });

  test("When field is needs_repair, shows error if search term is not 'y', 'yes', 'n' or 'no'.", async () => {
    await formatSelect.selectOption("tapes");
    await fieldSelect.selectOption("needs_repair");
    await searchInput.fill("Unicorn");
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(needsRepairValidationMsg);
  });

  test("Shows error message if there are no results.", async () => {
    const zeroResultTerm = "🦄🦄🦄🦄🦄";
    const noResultMsg = `No matching results found for: ${zeroResultTerm}`;

    await formatSelect.selectOption("records");
    await fieldSelect.selectOption("artist");
    await searchInput.fill(zeroResultTerm);
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(noResultMsg);
  });

  test("Shows all items when records and artist are selected, but no search term is entered and search btn is clicked.", async () => {
    await formatSelect.selectOption("records");
    await fieldSelect.selectOption("artist");
    await searchButton.click();

    const resultsDivChildren = resultsDiv.locator("> *");

    // Assert that the container now has at least 1 child element
    await expect(resultsDivChildren).not.toHaveCount(0);
  });

  test("Shows all items when tapes and artist are selected, but no search term is entered and search btn is clicked.", async () => {
    await formatSelect.selectOption("tapes");
    await fieldSelect.selectOption("artist");
    await searchButton.click();

    const resultsDivChildren = resultsDiv.locator("> *");

    // Assert that the container now has at least 1 child element
    await expect(resultsDivChildren).not.toHaveCount(0);
  });

  test("Shows all items when cds and artist are selected, but no search term is entered and search btn is clicked.", async () => {
    await formatSelect.selectOption("cds");
    await fieldSelect.selectOption("artist");
    await searchButton.click();

    const resultsDivChildren = resultsDiv.locator("> *");

    // Assert that the container now has at least 1 child element
    await expect(resultsDivChildren).not.toHaveCount(0);
  });

  test("Shows all items when cd comps and title are selected, but no search term is entered and search btn is clicked.", async () => {
    await formatSelect.selectOption("cd-compilations");
    await fieldSelect.selectOption("title");
    await searchButton.click();

    const resultsDivChildren = resultsDiv.locator("> *");

    // Assert that the container now has at least 1 child element
    await expect(resultsDivChildren).not.toHaveCount(0);
  });

  test("Shows all items when cd singles and artist are selected, but no search term is entered and search btn is clicked.", async () => {
    await formatSelect.selectOption("cd-singles");
    await fieldSelect.selectOption("artist");
    await searchButton.click();

    const resultsDivChildren = resultsDiv.locator("> *");

    // Assert that the container now has at least 1 child element
    await expect(resultsDivChildren).not.toHaveCount(0);
  });

  test("Shows all items when all formats and artist are selected, but no search term is entered and search btn is clicked.", async () => {
    await formatSelect.selectOption("all-formats");
    await fieldSelect.selectOption("ARTIST");
    await searchButton.click();

    const resultsDivChildren = resultsDiv.locator("> *");

    // Assert that the container now has at least 1 child element
    await expect(resultsDivChildren).not.toHaveCount(0);
  });

  test.skip("The field input is disabled until a format is selected.", async () => {});
  test.skip("The search input is disabled until a field is selected.", async () => {});
  test.skip("Displays error msg if no field is selected and search btn clicked.", async () => {});

  test.skip("Shows items containing the search term.", async () => {});

  test.skip("WRITE MORE TESTS HERE.", async () => {});
});
