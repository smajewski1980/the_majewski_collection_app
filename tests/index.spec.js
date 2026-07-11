import { test, expect, _electron as electron } from "@playwright/test";
import * as fs from "fs";
import fsProm from "node:fs/promises";
import * as path from "path";
import constants from "../constants.js";
// import pool from "../dbconnect.js";

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

    // helper func to get and click the two buttons
    async function clickUpdateWebAndConfBtns() {
      await page.getByRole("button", { name: "UPDATE WEB CATALOG" }).click();
      await page.getByRole("button", { name: "UPDATE", exact: true }).click();
    }

    // Clean BEFORE the test to guarantee a fresh state
    test.beforeEach(() => {
      filenames.forEach((filename) => {
        try {
          fs.unlinkSync(path.join(testDataPath, filename));
        } catch (error) {
          // Ignore errors if files don't exist yet
        }
      });
    });

    // Clean AFTER the test to leave a clean environment
    test.afterEach(() => {
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
      await clickUpdateWebAndConfBtns();

      await expect(toast).toHaveText(constants.toast.WEB_UPDATE_SUCCESS_MSG);
    });

    test("Files are created during the update web catalog process", async () => {
      await page.reload();

      await clickUpdateWebAndConfBtns();

      // Polling assertion: Loops and waits up to 5 seconds for all files to return true
      await expect
        .poll(
          () => {
            return filenames.every((filename) =>
              fs.existsSync(path.join(testDataPath, filename)),
            );
          },
          {
            message: "Timed out waiting for all catalog files to be created.",
            timeout: 5000,
          },
        )
        .toBe(true);
    });

    test("Files each have json objects with the appropriate keys", async () => {
      await page.reload();
      await clickUpdateWebAndConfBtns();

      filenames.forEach(async (file) => {
        try {
          const jsonData = await fsProm.readFile(
            path.join(testDataPath, file),
            "utf8",
          );
          const data = await JSON.parse(jsonData);
          const firstItem = await data[0];
          const currKeys = Object.keys(firstItem).sort();
          const format = file.split(".")[0];
          const expectedKeys = constants.data[`WEB_DATA_KEYS_${format}`].sort();

          await expect(currKeys).toEqual(expectedKeys);
        } catch (error) {
          console.log(error);
        }
      });
    });

    // helper for the final test
    async function getCurrentDbRowQtys() {
      // in order to use the pool, it has to be in the electron instance
      const databaseResult = await electronApp.evaluate(async () => {
        const res = await global.dbPool.query(
          "SELECT * FROM current_table_qtys",
        );
        // get the values in an array as numbers for comparison
        return res.rows.map((result) => parseInt(result.count));
      });
      return databaseResult;
    }

    // helper for the final test
    async function getFileItemQtys() {
      const fileItemQtys = [];

      for (let i = 0; i < filenames.length; i++) {
        try {
          // open the file and push the len to the array
          const jsonData = await fsProm.readFile(
            path.join(testDataPath, filenames[i]),
            "utf8",
          );
          const data = await JSON.parse(jsonData);
          const length = await data.length;
          fileItemQtys.push(length);
        } catch (error) {
          console.log(error);
          return error;
        }
      }
      return fileItemQtys;
    }

    test("Check each file contains the correct number of items", async () => {
      await page.reload();
      await clickUpdateWebAndConfBtns();

      const dbQtys = await getCurrentDbRowQtys();
      const fileItemQtys = await getFileItemQtys();

      await expect(fileItemQtys.sort()).toEqual(dbQtys.sort());
    });
  });
});
