import { test, expect, _electron as electron } from "@playwright/test";
import constants, { updateFormVals } from "../constants.js";
import * as path from "path";
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
  await page.getByRole("link", { name: "UPDATE ITEMS" }).click();
});

test.afterAll(async () => {
  // Close the app at the end of the test
  await electronApp.close();
});

test.describe("UPDATE ITEMS", () => {
  test.describe("CD COMPS", () => {
    // add an item to update
    test.beforeAll(async () => {
      try {
        const res = await electronApp.evaluate(
          // going to have to adjust this later when we get to being able to update tracks
          async ({ app }, updateFormVals) => {
            const res = await global.dbPool.query(
              "INSERT INTO cd_compilations VALUES($1, $2, $3, $4)",
              [
                updateFormVals.UPDATE_TEST_ITEM_CD_COMP.title_id,
                updateFormVals.UPDATE_TEST_ITEM_CD_COMP.title,
                updateFormVals.UPDATE_TEST_ITEM_CD_COMP.year,
                updateFormVals.UPDATE_TEST_ITEM_CD_COMP.location,
              ],
            );
            if (res) console.log("test item successfully added");
            return res;
          },
          updateFormVals,
        );
        await expect(res.rowCount).toBe(1);
      } catch (error) {
        console.log(error);
      }
    });
    // delete the added item
    test.afterAll(async () => {
      try {
        await electronApp.evaluate(
          // going to have to adjust this later when we get to being able to update tracks
          async ({ app }, constants) => {
            const { rowCount } = await global.dbPool.query(
              "DELETE FROM cd_compilations WHERE title_id = $1",
              [constants.data.UPDATE_TEST_ITEM_ID],
            );

            if (!rowCount) {
              throw new Error("something went wrong, no rows deleted");
            } else {
              console.log("test item was successfully deleted from db");
            }
          },
          constants,
        );
      } catch (error) {
        console.log(error);
      }
    });
    test("delete button is inert when the form loads", async () => {
      const deleteBtn = page.getByRole("button", { name: "DELETE ITEM" });
      // once this is all up and running move this to top level of describe block
      await expect(deleteBtn).toHaveAttribute("inert");
    });
    test.skip("write some CD COMPS tests", async () => {});
  });
  test.describe("CD SINGLES", () => {
    test.skip("write some CD SINGLES tests", async () => {});
  });
  test.describe("CDS MAIN", () => {
    test.skip("write some CDS MAIN tests", async () => {});
  });
  test.describe("RECORDS", () => {
    test.skip("write some RECORDS tests", async () => {});
  });
  test.describe("TAPES", () => {
    test.skip("write some TAPES tests", async () => {});
  });
});
