import { test, expect, _electron as electron } from "@playwright/test";

let electronApp;
let page;
let formatSelect;
let fieldSelect;
let searchInput;
let searchButton;
let resultsDiv;
let infoPopover;

// the setup objects
const testCdSingleObj = {
  case_type: "Jewel Case",
  artist: "UNICORN TESTER CD SINGLE",
  title: "UNICORN TESTER CD SINGLE TITLE",
  single_id: "392",
  tracks: {
    1236: "Unicorn Track 1",
    1237: "Unicorn Track 2",
    1238: "Unicorn Track 3",
  },
  year: "1980",
};

const testCdCompObj = {
  location: "Soundtrack 10",
  title: "UNICORN TESTER CD COMP TITLE",
  title_id: "738",
  tracks: {
    1313: { artist: "Unicorn Artist 1", track_name: "Unicorn Track 1" },
    1314: { artist: "Unicorn Artist 2", track_name: "Unicorn Track 2" },
    1315: { artist: "Unicorn Artist 3", track_name: "Unicorn Track 3" },
    1316: { artist: "Unicorn Artist 4", track_name: "Unicorn Track 4" },
    1317: { artist: "Unicorn Artist 5", track_name: "Unicorn Track 5" },
  },
  year: "1980",
};

const testCdObj = {
  artist: "UNICORN TESTER CD",
  id: "544",
  location: "Jazz 12",
  title: "UNICORN TESTER CD TITLE",
};

const testTapeObj = {
  artist: "UNICORN TESTER TAPE",
  id: "274",
  location: "Cassettes Box 13",
  needs_repair: "No",
  speed: "na",
  title: "UNICORN TESTER TAPE TITLE",
  year: "1980",
};

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
  // helper function to enter the data into the inputs
  async function enterFormData(field) {
    await formatSelect.selectOption("records");
    await fieldSelect.selectOption(field);
    await searchInput.fill(testRecordObj[`${field}`]);
    await searchButton.click();
  }

  // helper function to assert the data
  async function assertRecordData() {
    await expect(resultsDiv).toContainText(testRecordObj.id);
    await expect(resultsDiv).toContainText(testRecordObj.artist);
    await expect(resultsDiv).toContainText(testRecordObj.title);
    await expect(resultsDiv).toContainText(testRecordObj.location);
  }

  test("Shows additional info popover when an item is clicked.", async () => {
    await enterFormData("artist");

    const resultItem = page.locator(`.item-idx-${testRecordObj.id}`);
    await resultItem.click();

    await expect(infoPopover).toContainText(testRecordObj.artist);
    await expect(infoPopover).toContainText(testRecordObj.title);
    await expect(infoPopover).toContainText(testRecordObj.label);
    await expect(infoPopover).toContainText(testRecordObj.record_condition);
    await expect(infoPopover).toContainText(testRecordObj.sleeve_condition);
    await expect(infoPopover).toContainText(testRecordObj.year);
  });

  // Data-driven loop collapses 9 identical test blocks into 1 clean container
  const searchFields = [
    { field: "artist", label: "ARTIST" },
    { field: "diameter", label: "DIAMETER" },
    { field: "id", label: "ID" },
    { field: "label", label: "LABEL" },
    { field: "location", label: "LOCATION" },
    { field: "record_condition", label: "RECORD CONDITION" },
    { field: "sleeve_condition", label: "SLEEVE CONDITION" },
    { field: "title", label: "TITLE" },
    { field: "year", label: "YEAR" },
  ];

  for (const { field, label } of searchFields) {
    test(`Shows items containing the search term when the field is ${label}.`, async () => {
      await enterFormData(field);
      await assertRecordData();
    });
  }
});

test.describe("LOOKUP - TAPES", () => {
  // helper function to enter the data into the inputs
  async function enterFormData(field) {
    await formatSelect.selectOption("tapes");
    await fieldSelect.selectOption(field);
    await searchInput.fill(testTapeObj[`${field}`]);
    await searchButton.click();
  }

  // helper function to assert the data
  async function assertTapeData() {
    await expect(resultsDiv).toContainText(testTapeObj.id);
    await expect(resultsDiv).toContainText(testTapeObj.artist);
    await expect(resultsDiv).toContainText(testTapeObj.title);
    await expect(resultsDiv).toContainText(testTapeObj.location);
  }

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

  // Data-driven loop collapses 7 identical test blocks into 1 clean container
  const searchFields = [
    { field: "artist", label: "ARTIST" },
    { field: "id", label: "ID" },
    { field: "location", label: "LOCATION" },
    { field: "needs_repair", label: "NEEDS REPAIR" },
    { field: "speed", label: "SPEED" },
    { field: "title", label: "TITLE" },
    { field: "year", label: "YEAR" },
  ];

  for (const { field, label } of searchFields) {
    test(`Shows items containing the search term when the field is ${label}.`, async () => {
      await enterFormData(field);
      await assertTapeData();
    });
  }
});

test.describe("LOOKUP - CDS", () => {
  // helper function to enter the data into the inputs
  async function enterFormData(field) {
    await formatSelect.selectOption("cds");
    await fieldSelect.selectOption(field);
    await searchInput.fill(testCdObj[`${field}`]);
    await searchButton.click();
  }

  // helper function to assert the data
  async function assertCdData() {
    await expect(resultsDiv).toContainText(testCdObj.id);
    await expect(resultsDiv).toContainText(testCdObj.artist);
    await expect(resultsDiv).toContainText(testCdObj.title);
    await expect(resultsDiv).toContainText(testCdObj.location);
  }

  // Data-driven loop collapses 4 identical test blocks into 1 clean container
  const searchFields = [
    { field: "artist", label: "ARTIST" },
    { field: "id", label: "ID" },
    { field: "location", label: "LOCATION" },
    { field: "title", label: "TITLE" },
  ];

  for (const { field, label } of searchFields) {
    test(`Shows items containing the search term when the field is ${label}.`, async () => {
      await enterFormData(field);
      await assertCdData();
    });
  }
});

test.describe("LOOKUP - CD COMPS", () => {
  // helper function to enter the data into the inputs
  async function enterFormData(field) {
    await formatSelect.selectOption("cd-compilations");
    await fieldSelect.selectOption(field);
    await searchInput.fill(testCdCompObj[`${field}`]);
    await searchButton.click();
  }

  // helper function to assert the data
  async function assertCdCompData() {
    await expect(resultsDiv).toContainText(testCdCompObj.title);
    await expect(resultsDiv).toContainText(testCdCompObj.title_id);
    await expect(resultsDiv).toContainText(testCdCompObj.location);
    await expect(resultsDiv).toContainText(testCdCompObj.year);
  }

  // Data-driven loop collapses 4 identical test blocks into 1 clean container
  const searchFields = [
    { field: "title", label: "TITLE" },
    { field: "location", label: "LOCATION" },
    { field: "title_id", label: "TITLE ID" },
    { field: "year", label: "YEAR" },
  ];

  for (const { field, label } of searchFields) {
    test(`Shows items containing the search term when the field is ${label}.`, async () => {
      await enterFormData(field);
      await assertCdCompData();
    });
  }

  // Data-driven loop collapses 3 identical test blocks into 1 clean container
  const testTrackId = Object.keys(testCdCompObj.tracks)[0];
  const testArtist = testCdCompObj.tracks[testTrackId].artist;
  const testTrackName = testCdCompObj.tracks[testTrackId].track_name;
  const searchData = [
    {
      field: "track_id",
      label: "TRACK ID",
      term: testTrackId,
    },
    {
      field: "artist",
      label: "ARTIST",
      term: testArtist,
    },
    {
      field: "track_name",
      label: "TRACK NAME",
      term: testTrackName,
    },
  ];

  for (const { field, label, term } of searchData) {
    test(`Shows item containing the search term when the field is ${label}.`, async () => {
      await formatSelect.selectOption("cd-compilations");
      await fieldSelect.selectOption(field);
      await searchInput.fill(term);
      await searchButton.click();

      const resultItem = page.locator(`.item-idx-${testCdCompObj.title_id}`);

      expect(resultItem).toBeInViewport();
    });
  }

  test("Shows additional info popover when an item is clicked.", async () => {
    enterFormData("title");

    const resultItem = page.locator(`.item-idx-${testCdCompObj.title_id}`);
    await resultItem.click();

    expect(infoPopover).toContainText(testCdCompObj.title);
    expect(infoPopover).toContainText(testCdCompObj.tracks[testTrackId].artist);
    expect(infoPopover).toContainText(
      testCdCompObj.tracks[testTrackId].track_name,
    );
  });
});

test.describe("LOOKUP - CD SINGLES", () => {
  // helper function to enter the data into the inputs
  async function enterFormData(field) {
    await formatSelect.selectOption("cd-singles");
    await fieldSelect.selectOption(field);
    await searchInput.fill(testCdSingleObj[`${field}`]);
    await searchButton.click();
  }

  // helper function to assert the data
  async function assertCdSingleData() {
    await expect(resultsDiv).toContainText(testCdSingleObj.single_id);
    await expect(resultsDiv).toContainText(testCdSingleObj.artist);
    await expect(resultsDiv).toContainText(testCdSingleObj.title);
    await expect(resultsDiv).toContainText(testCdSingleObj.case_type);
    await expect(resultsDiv).toContainText(testCdSingleObj.year);
  }

  // Data-driven loop collapses 4 identical test blocks into 1 clean container
  const searchFields = [
    { field: "single_id", label: "SINGLE ID" },
    { field: "artist", label: "ARTIST" },
    { field: "title", label: "TITLE" },
    { field: "year", label: "YEAR" },
    { field: "case_type", label: "CASE TYPE" },
  ];

  for (const { field, label } of searchFields) {
    test(`Shows items containing the search term when the field is ${label}.`, async () => {
      await enterFormData(field);
      await assertCdSingleData();
    });
  }

  // Data-driven loop collapses 4 identical test blocks into 1 clean container
  const testSingleTrackId = Object.keys(testCdSingleObj.tracks)[0];
  const testSingleArtist = testCdSingleObj.artist;
  const testSingleTrackName = testCdSingleObj.tracks[testSingleTrackId];
  const singleSearchData = [
    {
      field: "track_id",
      label: "TRACK ID",
      term: testSingleTrackId,
    },
    {
      field: "artist",
      label: "ARTIST",
      term: testSingleArtist,
    },
    {
      field: "track_name",
      label: "TRACK NAME",
      term: testSingleTrackName,
    },
  ];

  for (const { field, label, term } of singleSearchData) {
    test(`Shows item containing the search term when the field is ${label}.`, async () => {
      await formatSelect.selectOption("cd-singles");
      await fieldSelect.selectOption(field);
      await searchInput.fill(term);
      await searchButton.click();

      const resultItem = page.locator(`.item-idx-${testCdSingleObj.single_id}`);

      expect(resultItem).toBeInViewport();
    });
  }

  test("Shows additional info popover when an item is clicked.", async () => {
    enterFormData("artist");

    const resultItem = page.locator(`.item-idx-${testCdSingleObj.single_id}`);
    await resultItem.click();

    expect(infoPopover).toContainText(testCdSingleObj.artist);
    expect(infoPopover).toContainText(testCdSingleObj.title);
    expect(infoPopover).toContainText(
      testCdSingleObj.tracks[testSingleTrackId],
    );
  });
});

test.describe("LOOKUP - ALL FORMATS", () => {
  test("Shows items containing the search term when the field is ARTIST.", async () => {
    const expectedStrings = [
      testCdSingleObj.single_id,
      testCdSingleObj.artist,
      testCdSingleObj.title,
      testCdSingleObj.case_type,
      testCdCompObj.title_id,
      testCdCompObj.tracks[Object.keys(testCdCompObj.tracks)[0]].artist,
      testCdCompObj.tracks[Object.keys(testCdCompObj.tracks)[1]].artist,
      testCdCompObj.tracks[Object.keys(testCdCompObj.tracks)[2]].artist,
      testCdCompObj.tracks[Object.keys(testCdCompObj.tracks)[3]].artist,
      testCdCompObj.tracks[Object.keys(testCdCompObj.tracks)[4]].artist,
      testCdCompObj.tracks[Object.keys(testCdCompObj.tracks)[0]].track_name,
      testCdCompObj.tracks[Object.keys(testCdCompObj.tracks)[1]].track_name,
      testCdCompObj.tracks[Object.keys(testCdCompObj.tracks)[2]].track_name,
      testCdCompObj.tracks[Object.keys(testCdCompObj.tracks)[3]].track_name,
      testCdCompObj.tracks[Object.keys(testCdCompObj.tracks)[4]].track_name,
      testCdCompObj.location,
      ...Object.values(testCdObj),
      testRecordObj.id,
      testRecordObj.artist,
      testRecordObj.title,
      testRecordObj.location,
      testTapeObj.id,
      testTapeObj.artist,
      testTapeObj.title,
      testTapeObj.location,
    ];

    await formatSelect.selectOption("all-formats");
    await fieldSelect.selectOption("ARTIST");
    await searchInput.fill("UNICORN");
    await searchButton.click();

    expectedStrings.forEach(
      async (str) => await expect(resultsDiv).toContainText(str),
    );
  });
});
