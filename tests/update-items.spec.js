import { test, expect, _electron as electron } from "@playwright/test";
import constants, { updateFormVals } from "../constants.js";
import * as path from "path";
import { listenerCount } from "process";
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
  test.describe("General page tests", () => {
    let toast;

    const dataArray = [
      "Cd-Compilations",
      "Cd-Singles",
      "Cd-Main Catalog",
      "Records",
      "Tapes",
    ];

    test.beforeEach(async () => {
      await page.reload();
      toast = await page.locator(".page-message");
    });

    test("delete button is inert when the page loads", async () => {
      const deleteBtn = page.getByRole("button", { name: "DELETE ITEM" });
      // once this is all up and running move this to top level of describe block
      await expect(deleteBtn).toHaveAttribute("inert");
    });

    test("Throws toast if update id form is submitted with no id", async () => {
      await page.getByRole("button", { name: "load data" }).click();

      await expect(toast).toHaveText(constants.toast.valErr.UPDATE_NO_ID_MSG);
    });

    test("Throws toast if update id form is submitted with id and no format selected", async () => {
      // get page items
      const idInput = await page.getByLabel("id to update");
      const idSubmit = await page.getByRole("button", { name: "load data" });

      await idInput.fill(constants.data.UPDATE_ID_FORM_TEST_VALID_ID);
      await idSubmit.click();

      await expect(toast).toHaveText(
        constants.toast.valErr.UPDATE_NO_SEL_FORMAT_MSG,
      );
    });

    test("toast is thrown if increment location is checked without a form loaded", async () => {
      await page.getByRole("checkbox").click();

      await expect(toast).toHaveText(constants.toast.valErr.NO_ACTIVE_FORM_MSG);
    });

    test("increment location stays unchecked when clicked without a form loaded", async () => {
      const checkbox = await page.getByRole("checkbox");
      await checkbox.click();

      await expect(toast).toHaveText(constants.toast.valErr.NO_ACTIVE_FORM_MSG);
      await expect(checkbox).not.toBeChecked();
    });

    dataArray.forEach((type) => {
      test(`When the ${type} nav btn is clicked it has active-nav-btn class`, async () => {
        // get and click the nav btn to select the format
        const navBtn = await page.getByRole("button", { name: `${type}` });
        await navBtn.click();

        await expect(navBtn).toHaveClass(/active-nav-btn/);
      });

      test(`delete button is enabled when ${type} nav btn is selected and when update id form is submitted`, async () => {
        // get page items
        const navBtn = await page.getByRole("button", { name: `${type}` });
        const idInput = await page.getByLabel("id to update");
        const idSubmit = await page.getByRole("button", { name: "load data" });
        const deleteBtn = page.getByRole("button", { name: "DELETE ITEM" });
        // interact with items
        await navBtn.click();
        await idInput.fill(
          constants.data.UPDATE_ID_FORM_TEST_VALID_ID.toString(),
        );
        await idSubmit.click();

        await expect(deleteBtn).toBeEnabled();
      });

      test(`the reset button resets the page to its original state after ${type} update form is loaded`, async () => {
        // get page items
        const navBtn = await page.getByRole("button", { name: `${type}` });
        const idInput = await page.getByLabel("id to update");
        const idSubmit = await page.getByRole("button", { name: "load data" });
        const resetBtn = await page.getByRole("button", { name: "reset" });
        const deleteBtn = page.getByRole("button", { name: "DELETE ITEM" });
        // interact with items
        await navBtn.click();
        await idInput.fill(
          constants.data.UPDATE_ID_FORM_TEST_VALID_ID.toString(),
        );
        await idSubmit.click();

        const currForm = await page.locator(".active-form");
        await expect(currForm).toBeVisible();
        await resetBtn.click();

        const activeNavBtn = await page.locator(".active-nav-btn");
        await expect(activeNavBtn).toHaveCount(0);
        await expect(idInput).toHaveValue("");
        await expect(deleteBtn).toHaveAttribute("inert");
      });

      test(`the reset button resets the page to its original state after ${type} format is selected and id is entered but not submitted`, async () => {
        // get page items
        const navBtn = await page.getByRole("button", { name: `${type}` });
        const idInput = await page.getByLabel("id to update");
        const resetBtn = await page.getByRole("button", { name: "reset" });
        const deleteBtn = page.getByRole("button", { name: "DELETE ITEM" });
        // interact with items
        await navBtn.click();
        await idInput.fill(
          constants.data.UPDATE_ID_FORM_TEST_VALID_ID.toString(),
        );
        await resetBtn.click();

        const activeNavBtn = await page.locator(".active-nav-btn");
        await expect(activeNavBtn).toHaveCount(0);
        await expect(idInput).toHaveValue("");
        await expect(deleteBtn).toHaveAttribute("inert");
      });

      test(`Throws correct toast if update id form is submitted with invalid id and ${type} format selected`, async () => {
        // get page items
        const navBtn = await page.getByRole("button", { name: `${type}` });
        const idInput = await page.getByLabel("id to update");
        const idSubmit = await page.getByRole("button", { name: "load data" });

        await navBtn.click();
        await idInput.fill(
          constants.data.UPDATE_TEST_ITEM_ID.toString().slice(1),
        );
        await idSubmit.click();

        await expect(toast).toHaveText(
          `Error: No ${type === "Cd-Main Catalog" ? "Cds" : type} found with that id.`,
        );
      });
    });
  });

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

    test.skip("updates the item when an updated title is entered", async () => {});
    test.skip("updates the item when an updated year is entered", async () => {});
    test.skip("updates the item when an updated valid location is entered", async () => {});
    test.skip("throws toast when an updated invalid location is entered", async () => {});
    test.skip("throws toast when an updated invalid year is entered", async () => {});
    test.skip("throws sucess toast when an item is updated", async () => {});
    test.skip("session list reflects a valid item update", async () => {});
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
