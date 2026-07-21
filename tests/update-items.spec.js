import { test, expect, _electron as electron } from "@playwright/test";
import constants, { updateFormVals } from "../constants.js";
import * as path from "path";
import { listenerCount } from "process";
import { session } from "electron";
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
      const deleteBtn = await page.getByRole("button", { name: "DELETE ITEM" });
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
    let toast, titleInput, activeForm, submitUpdateBtn;
    // add an item to update
    test.beforeAll(async () => {
      const rowCount = await electronApp.evaluate(
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
          if (res) console.log("test cd comp successfully added");

          const trackRes = await global.dbPool.query(
            "INSERT INTO cd_compilations_tracks(artist, track_name, title_id) VALUES ($1, $2, $3)",
            [
              updateFormVals.UPDATE_TEST_ITEM_CD_COMP.tracks[0],
              updateFormVals.UPDATE_TEST_ITEM_CD_COMP.tracks[1],
              updateFormVals.UPDATE_TEST_ITEM_CD_COMP.title_id,
            ],
          );

          if (trackRes) console.log("test comp track successfully added");

          return trackRes.rowCount;
        },
        updateFormVals,
      );
      await expect(rowCount).toBe(1);
    });
    // delete the added item
    test.afterAll(async () => {
      await electronApp.evaluate(
        // going to have to adjust this later when we get to being able to update tracks
        async ({ app }, updateFormVals) => {
          const { rowCount } = await global.dbPool.query(
            "DELETE FROM cd_compilations WHERE title_id = $1",
            [updateFormVals.UPDATE_TEST_ITEM_CD_COMP.title_id],
          );

          if (!rowCount) {
            throw new Error("something went wrong, no rows deleted");
          } else {
            console.log("test cd comp was successfully deleted from db");
          }
        },
        updateFormVals,
      );
    });

    test.beforeEach(async () => {
      await page.reload();
      toast = await page.locator(".page-message");
      // select the format
      const navBtn = await page.getByRole("button", {
        name: "Cd-Compilations",
      });
      await navBtn.click();
      // add the test id to the update id input
      const idInput = await page.locator("#update-id");
      await idInput.fill(
        updateFormVals.UPDATE_TEST_ITEM_CD_COMP.title_id.toString(),
      );
      // get and click the load data btn
      const idSubmit = await page.getByRole("button", { name: "load data" });
      await idSubmit.click();
      // get the active form and assert its correct
      activeForm = await page.locator(".active-form");
      await expect(activeForm).toHaveId("cd-comps-form");
      // assert a form field has correct value
      titleInput = await page.locator("#cd-comps-title");
      await expect(titleInput).toHaveValue(
        new RegExp(
          `${updateFormVals.UPDATE_TEST_ITEM_CD_COMP.title}|${constants.data.UPDATE_TEST_TEXT_VAL_2}`,
        ),
      );
      submitUpdateBtn = await activeForm.getByRole("button", {
        name: "submit",
      });
    });

    test("throws success toast if an updated title is submitted", async () => {
      // add an updated value to the input and submit
      await titleInput.fill(constants.data.UPDATE_TEST_TEXT_VAL_2);
      await submitUpdateBtn.click();
      // assert the success toast message
      await expect(toast).toHaveText(constants.toast.UPDATE_SUCCESS_MSG);
    });

    test("session list reflects a valid item update", async () => {
      const sessionList = await page.locator("#session-list");
      await expect(sessionList).toHaveText(
        new RegExp(`id: ${updateFormVals.UPDATE_TEST_ITEM_CD_COMP.title_id}`),
      );
      await expect(sessionList).toHaveText(
        new RegExp(`${constants.data.UPDATE_TEST_TEXT_VAL_2}`),
      );
    });

    test("throws error toast if form submitted with empty title field", async () => {
      // add an empty value to the input and submit
      await titleInput.fill("");
      await submitUpdateBtn.click();
      // assert the error toast message
      await expect(toast).toHaveText(
        constants.toast.valErr.NO_EMPTY_FIELDS_MSG,
      );
    });

    test("updates the item when an updated year is entered", async () => {
      // get the year input and submit an updated value
      const yearInput = await activeForm.getByRole("textbox", { name: "year" });
      await yearInput.fill("1234");
      await submitUpdateBtn.click();
      // assert the success toast message
      await expect(toast).toHaveText(constants.toast.UPDATE_SUCCESS_MSG);
    });

    test("throws error toast if form submitted with empty year field", async () => {
      // get the year input and submit an empty value
      const yearInput = await activeForm.getByRole("textbox", { name: "year" });
      await yearInput.fill("");
      await submitUpdateBtn.click();
      // assert the error toast message
      await expect(toast).toHaveText(
        constants.toast.valErr.NO_EMPTY_FIELDS_MSG,
      );
    });

    test("throws error toast if form submitted with with year that is not 4 digits in length", async () => {
      // get the year input and submit an empty value
      const yearInput = await activeForm.getByRole("textbox", { name: "year" });
      await yearInput.fill(constants.data.INVALID_FORMAT_YEAR);
      await submitUpdateBtn.click();
      // assert the error toast message
      await expect(toast).toHaveText(constants.toast.valErr.YEAR_FORMAT_MSG);
    });

    test("throws error toast if form submitted with with year that is not a number", async () => {
      // get the year input and submit an empty value
      const yearInput = await activeForm.getByRole("textbox", { name: "year" });
      await yearInput.fill(constants.data.INVALID_TYPE_YEAR);
      await submitUpdateBtn.click();
      // assert the error toast message
      await expect(toast).toHaveText(
        new RegExp(constants.toast.valErr.YEAR_TYPE_MSG),
      );
    });

    test("resets the page after a valid update", async () => {
      // just submit with no changes
      await submitUpdateBtn.click();
      // assert the success toast message
      await expect(toast).toHaveText(constants.toast.UPDATE_SUCCESS_MSG);

      // locate the items that should be reset and assert
      const activeNavBtn = await page.locator(".active-nav-btn");
      const idInput = await page.getByLabel("id to update");
      const deleteBtn = await page.getByRole("button", { name: "DELETE ITEM" });
      await expect(activeForm).not.toBeVisible();
      await expect(activeNavBtn).toHaveCount(0);
      await expect(idInput).toBeEmpty();
      await expect(deleteBtn).toHaveAttribute("inert");
    });

    test("updates the item when an updated valid location is entered", async () => {
      const locationInput = await activeForm.getByRole("textbox", {
        name: "location",
      });
      await locationInput.fill(constants.data.UPDATE_VALID_LOCATION);
      await submitUpdateBtn.click();
      // assert the success toast message
      await expect(toast).toHaveText(constants.toast.UPDATE_SUCCESS_MSG);
    });

    test("throws toast when an updated invalid location is entered", async () => {
      const locationInput = await activeForm.getByRole("textbox", {
        name: "location",
      });
      await locationInput.fill(constants.data.INVALID_LOCATION);
      await submitUpdateBtn.click();
      await expect(toast).toHaveText(
        constants.toast.valErr.LOCATION_INVALID_MSG,
      );
    });

    test("throws toast when no location is entered", async () => {
      const locationInput = await activeForm.getByRole("textbox", {
        name: "location",
      });
      await locationInput.fill("");
      await submitUpdateBtn.click();
      await expect(toast).toHaveText(
        constants.toast.valErr.NO_EMPTY_FIELDS_MSG,
      );
    });
  });

  test.describe("CD SINGLES", () => {
    let toast,
      activeForm,
      titleInput,
      submitUpdateBtn,
      yearInput,
      caseTypeInput,
      sessionList,
      artistInput;

    async function setup() {
      toast = await page.locator(".page-message");
      // select the format
      const navBtn = await page.getByRole("button", {
        name: "Cd-Singles",
      });
      await navBtn.click();
      // add the test id to the update id input
      const idInput = await page.locator("#update-id");
      await idInput.fill(
        updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.single_id.toString(),
      );
      // get and click the load data btn
      const idSubmit = await page.getByRole("button", { name: "load data" });
      await idSubmit.click();
      // get the active form and assert its correct
      activeForm = await page.locator(".active-form");
      await expect(activeForm).toHaveId("cd-singles-form");
      // assert a form field has correct value
      titleInput = await page.locator("#cd-singles-title");
      await expect(titleInput).toHaveValue(
        new RegExp(
          `${updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.title}|${constants.data.UPDATE_TEST_TEXT_VAL_2}`,
        ),
      );
      submitUpdateBtn = await activeForm.getByRole("button", {
        name: "submit",
      });
      yearInput = await activeForm.getByRole("textbox", { name: "year" });
      caseTypeInput = await page.locator("#cd-singles-case-type");
      sessionList = await page.locator("#session-list");
      artistInput = await activeForm.getByRole("textbox", {
        name: "artist",
      });
    }

    async function resetSessionList() {
      await electronApp.evaluate(async ({ global }) => {
        globalThis.sessionStore.currAdded = [];
        globalThis.sessionStore.isFirstSessionAdd = true;
      });
      await page.reload();
      await setup();
    }

    // add an item to update
    test.beforeAll(async () => {
      const rowCount = await electronApp.evaluate(
        async ({ app }, updateFormVals) => {
          const res = await global.dbPool.query(
            "INSERT INTO cd_singles VALUES($1, $2, $3, $4, $5)",
            [
              updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.single_id,
              updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.artist,
              updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.title,
              updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.year,
              updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.case_type,
            ],
          );
          if (res) console.log("test cd single successfully added");

          const trackRes = await global.dbPool.query(
            "INSERT INTO cd_singles_tracks(single_id, track_name) VALUES ($1, $2)",
            [
              updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.single_id,
              updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.tracks[0],
            ],
          );

          if (trackRes) console.log("test singles track successfully added");

          return trackRes.rowCount;
        },
        updateFormVals,
      );
      await expect(rowCount).toBe(1);
    });

    // delete the added item
    test.afterAll(async () => {
      await electronApp.evaluate(
        // going to have to adjust this later when we get to being able to update tracks
        async ({ app }, updateFormVals) => {
          const { rowCount } = await global.dbPool.query(
            "DELETE FROM cd_singles WHERE single_id = $1",
            [updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.single_id],
          );

          if (!rowCount) {
            throw new Error("something went wrong, no rows deleted");
          } else {
            console.log("test cd single was successfully deleted from db");
          }
        },
        updateFormVals,
      );
    });

    test.beforeEach(async () => {
      await page.reload();
      await setup();
    });

    test("throws success toast if a valid update is submitted", async () => {
      // add an updated value to the input and submit
      await titleInput.fill(constants.data.UPDATE_TEST_TEXT_VAL_2);
      await submitUpdateBtn.click();
      // assert the success toast message
      await expect(toast).toHaveText(constants.toast.UPDATE_SUCCESS_MSG);
    });

    test("session list reflects a valid item update", async () => {
      await expect(sessionList).toHaveText(
        new RegExp(
          `id: ${updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.single_id}`,
        ),
      );
      await expect(sessionList).toHaveText(
        new RegExp(`${constants.data.UPDATE_TEST_TEXT_VAL_2}`),
      );
    });

    test("throws error toast if empty artist field is submitted", async () => {
      await artistInput.fill("");
      await submitUpdateBtn.click();

      await expect(toast).toHaveText(
        constants.toast.valErr.NO_EMPTY_FIELDS_MSG,
      );
    });

    test("throws error toast if empty title field is submitted", async () => {
      await titleInput.fill("");
      await submitUpdateBtn.click();

      await expect(toast).toHaveText(
        constants.toast.valErr.NO_EMPTY_FIELDS_MSG,
      );
    });

    test("updates the item when an updated artist is entered", async () => {
      // need to reset the session list to be able to see if the update actually went through
      await resetSessionList();

      // make sure we are actually updating the value
      await expect(artistInput).toHaveValue(
        updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.artist,
      );
      await artistInput.fill(constants.data.UPDATE_TEST_TEXT_VAL_2);
      await submitUpdateBtn.click();

      await expect(sessionList).toHaveText(
        new RegExp(constants.data.UPDATE_TEST_TEXT_VAL_2),
      );
    });

    test("updates the item when an updated title is entered", async () => {
      // need to reset the session list to be able to see if the update actually went through
      await resetSessionList();

      // make sure we are actually updating the value
      await expect(titleInput).toHaveValue(
        constants.data.UPDATE_TEST_TEXT_VAL_2,
      );
      await titleInput.fill(updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.title);
      await submitUpdateBtn.click();

      await expect(sessionList).toHaveText(
        new RegExp(updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.title),
      );
    });

    test("updates the item when an updated year is entered", async () => {
      const updatedYear = "1234";

      // need to reset the session list to be able to see if the update actually went through
      await resetSessionList();

      // make sure we are actually updating the value
      await expect(yearInput).toHaveValue(
        updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.year,
      );
      await yearInput.fill(updatedYear);
      await submitUpdateBtn.click();

      await expect(sessionList).toHaveText(new RegExp(updatedYear));
    });

    test("updates the item when an updated valid case type is entered", async () => {
      // need to reset the session list to be able to see if the update actually went through
      await resetSessionList();

      // make sure we are actually updating the value
      await expect(caseTypeInput).toHaveValue(
        updateFormVals.UPDATE_TEST_ITEM_CD_SINGLE.case_type,
      );
      await caseTypeInput.fill(constants.data.VALID_LOCATION);
      await submitUpdateBtn.click();

      await expect(sessionList).toHaveText(
        new RegExp(constants.data.VALID_LOCATION),
      );
    });

    test("throws error toast if form submitted with empty year field", async () => {
      await yearInput.fill("");
      await submitUpdateBtn.click();

      await expect(toast).toHaveText(
        new RegExp(constants.toast.valErr.NO_EMPTY_FIELDS_MSG),
      );
    });

    test("throws error toast if form submitted with with year that is not 4 digits in length", async () => {
      await yearInput.fill(constants.data.INVALID_FORMAT_YEAR);
      await submitUpdateBtn.click();

      await expect(toast).toHaveText(
        new RegExp(constants.toast.valErr.INVALID_FORMAT_YEAR),
      );
    });

    test("throws error toast if form submitted with with year that is not a number", async () => {
      await yearInput.fill(constants.data.INVALID_TYPE_YEAR);
      await submitUpdateBtn.click();

      await expect(toast).toHaveText(
        new RegExp(constants.toast.valErr.INVALID_TYPE_YEAR),
      );
    });

    test("throws error toast when an updated invalid case type is entered", async () => {
      await caseTypeInput.fill(constants.data.INVALID_LOCATION);
      await submitUpdateBtn.click();

      await expect(toast).toHaveText(
        new RegExp(constants.toast.valErr.INVALID_LOCATION),
      );
    });

    test("throws error toast when no case type is entered", async () => {
      await caseTypeInput.fill("");
      await submitUpdateBtn.click();

      await expect(toast).toHaveText(
        new RegExp(constants.toast.valErr.NO_EMPTY_FIELDS_MSG),
      );
    });

    test("resets the page after a valid update", async () => {
      // just submit with no changes
      await submitUpdateBtn.click();
      // assert the success toast message
      await expect(toast).toHaveText(constants.toast.UPDATE_SUCCESS_MSG);

      // locate the items that should be reset and assert
      const activeNavBtn = await page.locator(".active-nav-btn");
      const idInput = await page.getByLabel("id to update");
      const deleteBtn = await page.getByRole("button", { name: "DELETE ITEM" });
      await expect(activeForm).not.toBeVisible();
      await expect(activeNavBtn).toHaveCount(0);
      await expect(idInput).toBeEmpty();
      await expect(deleteBtn).toHaveAttribute("inert");
    });
  });

  test.describe("CDS MAIN", () => {
    let toast,
      artistInput,
      titleInput,
      locationInput,
      submitUpdateBtn,
      activeForm;

    test.beforeAll(async () => {
      const rowCount = await electronApp.evaluate(
        async ({ app }, updateFormVals) => {
          const { rowCount } = await global.dbPool.query(
            "INSERT INTO cds VALUES($1, $2, $3, $4)",
            [
              updateFormVals.UPDATE_TEST_ITEM_CDS.id,
              updateFormVals.UPDATE_TEST_ITEM_CDS.artist,
              updateFormVals.UPDATE_TEST_ITEM_CDS.title,
              updateFormVals.UPDATE_TEST_ITEM_CDS.location,
            ],
          );

          if (rowCount) console.log("test cd successfully added");

          return rowCount;
        },
        updateFormVals,
      );

      await expect(rowCount).toBe(1);
    });

    test.afterAll(async () => {
      await electronApp.evaluate(async ({ app }, id) => {
        const { rowCount } = await global.dbPool.query(
          "DELETE FROM cds WHERE id = $1",
          [id],
        );

        if (!rowCount) {
          throw new Error("something went wrong, no rows deleted");
        } else {
          console.log("test cd was successfully deleted from db");
        }
      }, updateFormVals.UPDATE_TEST_ITEM_CDS.id);
    });

    test.beforeEach(async () => {
      await page.reload();

      toast = await page.locator(".page-message");
      artistInput = await page.locator("#cds-main-artist");
      titleInput = await page.locator("#cds-main-title");
      locationInput = await page.locator("#cds-main-location");
      activeForm = await page.locator(".active-form");
      submitUpdateBtn = await activeForm.getByRole("button", {
        name: "submit",
      });
      // select the format
      const navBtn = await page.getByRole("button", {
        name: "Cd-Main Catalog",
      });
      await navBtn.click();
      // add the test id to the update id input
      const idInput = await page.locator("#update-id");
      await idInput.fill(updateFormVals.UPDATE_TEST_ITEM_CDS.id.toString());
      // get and click the load data btn
      const idSubmit = await page.getByRole("button", { name: "load data" });
      await idSubmit.click();
      // get the active form and assert its correct
      await expect(activeForm).toHaveId("cd-main-form");
      // assert a form field has correct value
      await expect(titleInput).toHaveValue(
        new RegExp(
          `${updateFormVals.UPDATE_TEST_ITEM_CDS.title}|${constants.data.UPDATE_TEST_TEXT_VAL_2}`,
        ),
      );
    });

    test("throws success toast if a valid update is submitted", async () => {
      await submitUpdateBtn.click();

      await expect(toast).toHaveText(constants.toast.UPDATE_SUCCESS_MSG);
    });

    test.skip("session list reflects a valid item update", async () => {});
    test.skip("throws error toast if form submitted with empty artist field", async () => {});
    test.skip("throws error toast if form submitted with empty title field", async () => {});
    test.skip("throws error toast if form submitted with empty location field", async () => {});
    test.skip("throws error toast if form submitted with an invalid location field", async () => {});
    test.skip("resets the page after a valid update", async () => {});
    test.skip("updates the item if an updated artist is submitted", async () => {});
    test.skip("updates the item if an updated title is submitted", async () => {});
    test.skip("updates the item if an updated location is submitted", async () => {});
  });

  test.describe("RECORDS", () => {
    test.skip("write some RECORDS tests", async () => {});
  });
  test.describe("TAPES", () => {
    test.skip("write some TAPES tests", async () => {});
  });
});
