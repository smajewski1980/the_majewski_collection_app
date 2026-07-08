import { test, expect, _electron as electron } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import constants from "../constants.js";
// import handleGetWebUpdateData from "../ipc-handlers/handleGetWebUpdateData";

test.describe("HOMEPAGE", () => {
  let electronApp;
  let page;
  const testDataPath = path.join(__dirname, "testOutputFiles");

  test.beforeAll(async () => {
    // Launch the Electron application pointing to your main entry file (e.g., main.js)
    electronApp = await electron.launch({
      args: ["./main.js"],
      env: {
        ...process.env,
        DB_NAME: "test_music_catalog",
        TEST_OUTPUT_PATH: testDataPath,
      },
    });

    // Catch anything Electron tries to log to the terminal and route it to Playwright's terminal
    electronApp.process().stdout.on("data", (data) => {
      console.log(`Electron Main STDOUT: ${data.toString()}`);
    });

    // Wait for the first BrowserWindow to open
    page = await electronApp.firstWindow();
  });

  test.afterAll(async () => {
    // Close the app at the end of the test
    await electronApp.close();
  });

  test.beforeEach(async () => {
    const currentUrl = page.url();
    const isHomepage = currentUrl.endsWith("index.html");
    const dialog = page.getByRole("dialog");

    if (await dialog.isVisible()) {
      await page.getByRole("button", { name: "x" }).click();
      await expect(dialog).not.toBeVisible();
    }

    if (!isHomepage) {
      await page.getByAltText("the majewski collection").click();
    }
  });

  test("Application launches and loads UI", async () => {
    const button = page.getByRole("button", { name: "UPDATE WEB CATALOG" });
    const lookupLink = page.getByRole("link", { name: "LOOKUP" });
    const addLink = page.getByRole("link", { name: "ADD ITEMS" });
    const updateLink = page.getByRole("link", { name: "UPDATE ITEMS" });
    await expect(page).toHaveTitle("The Majewski Collection App");
    await expect(button).toBeVisible();
    await expect(lookupLink).toBeVisible();
    await expect(addLink).toBeVisible();
    await expect(updateLink).toBeVisible();
  });

  test("Clicking the LOOKUP button goes to the Lookup page", async () => {
    const lookupLink = page.getByRole("link", { name: "LOOKUP" });
    await lookupLink.click();
    await expect(page).toHaveTitle("The Majewski Collection Lookup");
  });

  test("Clicking the ADD ITEMS button goes to the insert page", async () => {
    const addLink = page.getByRole("link", { name: "ADD ITEMS" });
    await addLink.click();
    await expect(page).toHaveTitle("The Majewski Collection Add Items");
  });

  test("Clicking the UPDATE ITEMS button goes to the update page", async () => {
    const updateLink = page.getByRole("link", { name: "UPDATE ITEMS" });
    await updateLink.click();
    await expect(page).toHaveTitle("The Majewski Collection Update Items");
  });

  test("Clicking the UPDATE WEB CATALOG button opens the confirmation dialog", async () => {
    const button = page.getByRole("button", { name: "UPDATE WEB CATALOG" });
    const dialog = await page.getByRole("dialog");

    await button.click();

    await expect(dialog).toBeVisible();
  });

  test.describe("UPDATE WEB CATALOG", () => {
    const filenames = [
      "CD_COMPS.json",
      "CD_COMPS_TRACKS.json",
      "CD_SINGLES.json",
      "CD_SINGLES_TRACKS.json",
      "CDS.json",
      "RECORDS.json",
      "TAPES.json",
    ];

    test.afterEach(() => {
      // cleanup
      filenames.forEach((filename) => {
        try {
          fs.unlinkSync(path.join(testDataPath, filename));
          console.log(filename, " was deleted.");
        } catch (error) {
          console.log(error);
        }
      });
    });

    test("Success toast is thrown after the update web catalog process", async () => {
      await page.reload();

      const toast = await page.locator(".page-message");
      const updateButton = await page.getByRole("button", {
        name: "UPDATE WEB CATALOG",
      });
      await updateButton.click();
      const confirmButton = await page.getByRole("button", {
        name: "UPDATE",
        exact: true,
      });
      await confirmButton.click();
      await expect(toast).toHaveText(constants.toast.WEB_UPDATE_SUCCESS_MSG);
    });

    test("files are created during the update web catalog process", async () => {
      await page.reload();

      const toast = await page.locator(".page-message");
      const updateButton = await page.getByRole("button", {
        name: "UPDATE WEB CATALOG",
      });
      await updateButton.click();
      const confirmButton = await page.getByRole("button", {
        name: "UPDATE",
        exact: true,
      });
      await confirmButton.click();

      const cdCompsExists = fs.existsSync(
        path.join(testDataPath, "CD_COMPS.json"),
      );
      const cdCompsTracksExists = fs.existsSync(
        path.join(testDataPath, "CD_COMPS_TRACKS.json"),
      );
      const cdSinglesExists = fs.existsSync(
        path.join(testDataPath, "CD_SINGLES.json"),
      );
      const cdSinglesTracksExists = fs.existsSync(
        path.join(testDataPath, "CD_SINGLES_TRACKS.json"),
      );
      const cdsExists = fs.existsSync(path.join(testDataPath, "CDS.json"));
      const recordsExists = fs.existsSync(
        path.join(testDataPath, "RECORDS.json"),
      );
      const tapesExists = fs.existsSync(path.join(testDataPath, "TAPES.json"));

      expect({
        cdCompsExists,
        cdCompsTracksExists,
        cdSinglesExists,
        cdSinglesTracksExists,
        cdsExists,
        recordsExists,
        tapesExists,
      }).toEqual({
        cdCompsExists: true,
        cdCompsTracksExists: true,
        cdSinglesExists: true,
        cdSinglesTracksExists: true,
        cdsExists: true,
        recordsExists: true,
        tapesExists: true,
      });
    });

    // test each one has the right keys
    // test each one is the correct length
  });
});
