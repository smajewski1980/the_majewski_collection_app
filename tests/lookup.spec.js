import { test, expect, _electron as electron } from "@playwright/test";

let electronApp;
let page;
let formatSelect;
let fieldSelect;
let searchInput;
let searchButton;
let resultsDiv;
let infoPopover;

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
  infoPopover = page.locator("#info-popover");
});

test.describe("LOOKUP", () => {
  const numValidationMsg =
    "Please enter a valid number to search by that field.";
  const yearRangeMsg =
    "Please enter a valid 4 digit year between 1885 and the current year.";
  const recCondValidationMsg = "Please enter 1-5 *'s to search by condition.";
  const needsRepairValidationMsg =
    "For that field, term must be yes(y) or no(n).";
  const noFieldMsg = "Please select a field to search.";

  const testCdCompObj = {
    location: "UNICORN CD COMP BOX 47",
    title: "UNICORN TESTER CD COMP TITLE",
    title_id: "???", // enter these into test database and update this
    tracks: [
      ["Unicorn Artist 1", "Unicorn Track 1"],
      ["Unicorn Artist 2", "Unicorn Track 2"],
      ["Unicorn Artist 3", "Unicorn Track 3"],
      ["Unicorn Artist 4", "Unicorn Track 4"],
      ["Unicorn Artist 5", "Unicorn Track 5"],
    ],
    year: 1980,
  };

  const testCdSingleObj = {
    case_type: "UNICORN CASE",
    artist: "UNICORN TESTER CD SINGLE",
    title: "UNICORN TESTER CD SINGLE TITLE",
    single_id: "???", // enter these into test database and update this
    tracks: ["Unicorn Track 1", "Unicorn Track 2", "Unicorn Track 3"],
    year: 1980,
  };

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

  test("The field input is disabled until a format is selected.", async () => {
    await expect(fieldSelect).toHaveAttribute("inert");

    await formatSelect.selectOption("records");

    await expect(fieldSelect).not.toHaveAttribute("inert");
  });

  test("The search input and button is disabled until a field is selected.", async () => {
    await expect(searchInput).toHaveAttribute("inert");
    await expect(searchButton).toHaveAttribute("inert");

    await formatSelect.selectOption("records");
    await fieldSelect.selectOption("artist");

    await expect(searchInput).not.toHaveAttribute("inert");
    await expect(searchButton).not.toHaveAttribute("inert");
  });

  test("Displays error msg if no field is selected and search btn clicked.", async () => {
    await formatSelect.selectOption("records");
    await fieldSelect.selectOption("artist");
    await fieldSelect.selectOption("");
    await searchButton.click();

    const error = page.locator("#message");

    await expect(error).toHaveText(noFieldMsg);
  });
});

test.describe("LOOKUP - RECORDS", () => {
  const testRecordObj = {
    artist: "UNICORN TESTER RECORD",
    diameter: "12 inch",
    id: "807",
    label: "UNICORN RECORDS",
    location: "33s Jazz 3",
    record_condition: "***",
    sleeve_condition: "***",
    title: "UNICORN TESTER RECORD TITLE",
    year: "1980",
  };

  async function enterFormData(field) {
    await formatSelect.selectOption("records");
    await fieldSelect.selectOption(field);
    await searchInput.fill(testRecordObj[`${field}`]);
    await searchButton.click();
  }

  test("Shows items containing the search term when the field is ARTIST.", async () => {
    enterFormData("artist");

    await expect(resultsDiv).toContainText(testRecordObj.id);
    await expect(resultsDiv).toContainText(testRecordObj.artist);
    await expect(resultsDiv).toContainText(testRecordObj.title);
    await expect(resultsDiv).toContainText(testRecordObj.location);
  });

  test("Shows additional info popover when an item is clicked.", async () => {
    enterFormData("artist");

    const resultItem = page.locator(`.item-idx-${testRecordObj.id}`);
    await resultItem.click();

    expect(infoPopover).toContainText(testRecordObj.artist);
    expect(infoPopover).toContainText(testRecordObj.title);
    expect(infoPopover).toContainText(testRecordObj.label);
    expect(infoPopover).toContainText(testRecordObj.record_condition);
    expect(infoPopover).toContainText(testRecordObj.sleeve_condition);
    expect(infoPopover).toContainText(testRecordObj.year);
  });

  test("Shows items containing the search term when the field is DIAMETER.", async () => {
    enterFormData("diameter");

    await expect(resultsDiv).toContainText(testRecordObj.id);
    await expect(resultsDiv).toContainText(testRecordObj.artist);
    await expect(resultsDiv).toContainText(testRecordObj.title);
    await expect(resultsDiv).toContainText(testRecordObj.location);
  });

  test("Shows item containing the search term when the field is ID.", async () => {
    enterFormData("id");

    await expect(resultsDiv).toContainText(testRecordObj.id);
    await expect(resultsDiv).toContainText(testRecordObj.artist);
    await expect(resultsDiv).toContainText(testRecordObj.title);
    await expect(resultsDiv).toContainText(testRecordObj.location);
  });

  test("Shows items containing the search term when the field is LABEL.", async () => {
    enterFormData("label");

    await expect(resultsDiv).toContainText(testRecordObj.id);
    await expect(resultsDiv).toContainText(testRecordObj.artist);
    await expect(resultsDiv).toContainText(testRecordObj.title);
    await expect(resultsDiv).toContainText(testRecordObj.location);
  });

  test("Shows items containing the search term when the field is LOCATION.", async () => {
    enterFormData("location");

    await expect(resultsDiv).toContainText(testRecordObj.id);
    await expect(resultsDiv).toContainText(testRecordObj.artist);
    await expect(resultsDiv).toContainText(testRecordObj.title);
    await expect(resultsDiv).toContainText(testRecordObj.location);
  });

  test("Shows items containing the search term when the field is RECORD CONDITION.", async () => {
    enterFormData("record_condition");

    await expect(resultsDiv).toContainText(testRecordObj.id);
    await expect(resultsDiv).toContainText(testRecordObj.artist);
    await expect(resultsDiv).toContainText(testRecordObj.title);
    await expect(resultsDiv).toContainText(testRecordObj.location);
  });

  test("Shows items containing the search term when the field is SLEEVE CONDITION.", async () => {
    enterFormData("sleeve_condition");

    await expect(resultsDiv).toContainText(testRecordObj.id);
    await expect(resultsDiv).toContainText(testRecordObj.artist);
    await expect(resultsDiv).toContainText(testRecordObj.title);
    await expect(resultsDiv).toContainText(testRecordObj.location);
  });

  test("Shows items containing the search term when the field is TITLE.", async () => {
    enterFormData("title");

    await expect(resultsDiv).toContainText(testRecordObj.id);
    await expect(resultsDiv).toContainText(testRecordObj.artist);
    await expect(resultsDiv).toContainText(testRecordObj.title);
    await expect(resultsDiv).toContainText(testRecordObj.location);
  });

  test("Shows items containing the search term when the field is YEAR.", async () => {
    enterFormData("year");

    await expect(resultsDiv).toContainText(testRecordObj.id);
    await expect(resultsDiv).toContainText(testRecordObj.artist);
    await expect(resultsDiv).toContainText(testRecordObj.title);
    await expect(resultsDiv).toContainText(testRecordObj.location);
  });
});

test.describe("LOOKUP - TAPES", () => {
  const testTapeObj = {
    artist: "UNICORN TESTER TAPE",
    id: "274",
    location: "Cassettes Box 13",
    needs_repair: "No",
    speed: "na",
    title: "UNICORN TESTER TAPE TITLE",
    year: "1980",
  };

  async function enterFormData(field) {
    await formatSelect.selectOption("tapes");
    await fieldSelect.selectOption(field);
    await searchInput.fill(testTapeObj[`${field}`]);
    await searchButton.click();
  }

  test("Shows items containing the search term when the field is ARTIST.", async () => {
    enterFormData("artist");

    await expect(resultsDiv).toContainText(testTapeObj.id);
    await expect(resultsDiv).toContainText(testTapeObj.artist);
    await expect(resultsDiv).toContainText(testTapeObj.title);
    await expect(resultsDiv).toContainText(testTapeObj.location);
  });

  test("Shows additional info popover when an item is clicked.", async () => {
    enterFormData("artist");

    const resultItem = page.locator(`.item-idx-${testTapeObj.id}`);
    await resultItem.click();

    expect(infoPopover).toContainText(testTapeObj.artist);
    expect(infoPopover).toContainText(testTapeObj.title);
    expect(infoPopover).toContainText(testTapeObj.year);
    expect(infoPopover).toContainText(testTapeObj.needs_repair);
    expect(infoPopover).toContainText(testTapeObj.speed);
  });

  test("Shows items containing the search term when the field is ID.", async () => {
    enterFormData("id");

    await expect(resultsDiv).toContainText(testTapeObj.id);
    await expect(resultsDiv).toContainText(testTapeObj.artist);
    await expect(resultsDiv).toContainText(testTapeObj.title);
    await expect(resultsDiv).toContainText(testTapeObj.location);
  });

  test("Shows items containing the search term when the field is LOCATION.", async () => {
    enterFormData("location");

    await expect(resultsDiv).toContainText(testTapeObj.id);
    await expect(resultsDiv).toContainText(testTapeObj.artist);
    await expect(resultsDiv).toContainText(testTapeObj.title);
    await expect(resultsDiv).toContainText(testTapeObj.location);
  });

  test("Shows items containing the search term when the field is NEEDS REPAIR.", async () => {
    enterFormData("needs_repair");

    await expect(resultsDiv).toContainText(testTapeObj.id);
    await expect(resultsDiv).toContainText(testTapeObj.artist);
    await expect(resultsDiv).toContainText(testTapeObj.title);
    await expect(resultsDiv).toContainText(testTapeObj.location);
  });

  test("Shows items containing the search term when the field is SPEED.", async () => {
    enterFormData("speed");

    await expect(resultsDiv).toContainText(testTapeObj.id);
    await expect(resultsDiv).toContainText(testTapeObj.artist);
    await expect(resultsDiv).toContainText(testTapeObj.title);
    await expect(resultsDiv).toContainText(testTapeObj.location);
  });

  test("Shows items containing the search term when the field is TITLE.", async () => {
    enterFormData("title");

    await expect(resultsDiv).toContainText(testTapeObj.id);
    await expect(resultsDiv).toContainText(testTapeObj.artist);
    await expect(resultsDiv).toContainText(testTapeObj.title);
    await expect(resultsDiv).toContainText(testTapeObj.location);
  });

  test("Shows items containing the search term when the field is YEAR.", async () => {
    enterFormData("year");

    await expect(resultsDiv).toContainText(testTapeObj.id);
    await expect(resultsDiv).toContainText(testTapeObj.artist);
    await expect(resultsDiv).toContainText(testTapeObj.title);
    await expect(resultsDiv).toContainText(testTapeObj.location);
  });
});

test.describe("LOOKUP - CDS", () => {
  const testCdObj = {
    artist: "UNICORN TESTER CD",
    id: "544",
    location: "Jazz 12",
    title: "UNICORN TESTER CD TITLE",
  };

  async function enterFormData(field) {
    await formatSelect.selectOption("cds");
    await fieldSelect.selectOption(field);
    await searchInput.fill(testCdObj[`${field}`]);
    await searchButton.click();
  }

  test("Shows items containing the search term when the field is ARTIST.", async () => {
    enterFormData("artist");

    await expect(resultsDiv).toContainText(testCdObj.id);
    await expect(resultsDiv).toContainText(testCdObj.artist);
    await expect(resultsDiv).toContainText(testCdObj.title);
    await expect(resultsDiv).toContainText(testCdObj.location);
  });

  test("Shows items containing the search term when the field is ID.", async () => {
    enterFormData("id");

    await expect(resultsDiv).toContainText(testCdObj.id);
    await expect(resultsDiv).toContainText(testCdObj.artist);
    await expect(resultsDiv).toContainText(testCdObj.title);
    await expect(resultsDiv).toContainText(testCdObj.location);
  });

  test("Shows items containing the search term when the field is LOCATION.", async () => {
    enterFormData("location");

    await expect(resultsDiv).toContainText(testCdObj.id);
    await expect(resultsDiv).toContainText(testCdObj.artist);
    await expect(resultsDiv).toContainText(testCdObj.title);
    await expect(resultsDiv).toContainText(testCdObj.location);
  });

  test("Shows items containing the search term when the field is TITLE.", async () => {
    enterFormData("title");

    await expect(resultsDiv).toContainText(testCdObj.id);
    await expect(resultsDiv).toContainText(testCdObj.artist);
    await expect(resultsDiv).toContainText(testCdObj.title);
    await expect(resultsDiv).toContainText(testCdObj.location);
  });
});

test.describe("LOOKUP - CD COMPS", () => {
  test.skip("Shows items containing the search term when the field is TITLE.", async () => {});
  test.skip("Shows additional info popover when an item is clicked.", async () => {});
  test.skip("Shows items containing the search term when the field is LOCATION.", async () => {});
  test.skip("Shows items containing the search term when the field is TITLE ID.", async () => {});
  test.skip("Shows items containing the search term when the field is TRACK ID.", async () => {});
  test.skip("Shows items containing the search term when the field is ARTIST.", async () => {});
  test.skip("Shows items containing the search term when the field is TRACK NAME.", async () => {});
  test.skip("Shows items containing the search term when the field is YEAR.", async () => {});
});

test.describe("LOOKUP - CD SINGLES", () => {
  test.skip("Shows items containing the search term when the field is ARTIST.", async () => {});
  test.skip("Shows additional info popover when an item is clicked.", async () => {});
  test.skip("Shows items containing the search term when the field is CASE TYPE.", async () => {});
  test.skip("Shows items containing the search term when the field is SINGLE ID.", async () => {});
  test.skip("Shows items containing the search term when the field is TITLE.", async () => {});
  test.skip("Shows items containing the search term when the field is TRACK ID.", async () => {});
  test.skip("Shows items containing the search term when the field is TRACK NAME.", async () => {});
  test.skip("Shows items containing the search term when the field is YEAR.", async () => {});
});

test.describe("LOOKUP - ALL FORMATS", () => {
  test.skip("Shows items containing the search term when the field is ARTIST.", async () => {});
});
