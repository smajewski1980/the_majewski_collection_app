import { test, expect, _electron as electron } from "@playwright/test";

// have to construct insert objects to test with

let electronApp;
let page;

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
  await page.getByRole("link", { name: "ADD ITEMS" }).click();
});

test.afterAll(async () => {
  // Close the app at the end of the test
  await electronApp.close();
});

test.describe("ADD ITEMS", () => {
  test("blah blah", () => {
    expect(true).toBe(true);
  });

  test.describe("NAV buttons render the proper forms", () => {
    test.skip("When the Cd-Compilations button is clicked, the Cd-Compilations form is displayed.", async () => {});
    test.skip("When the Cd-Singles button is clicked, the Cd-Singles form is displayed.", async () => {});
    test.skip("When the Cd-Main Catalog button is clicked, the Cd-Main Catalog form is displayed.", async () => {});
    test.skip("When the Records button is clicked, the Records form is displayed.", async () => {});
    test.skip("When the Tapes button is clicked, the Tapes form is displayed.", async () => {});
  });

  test.describe("The forms", () => {
    test.describe("The cd-comps form", () => {
      test.skip("write cd-comp form tests", async () => {});
    });

    test.describe("The cd-singles form", () => {
      test.skip("write cd-singles form tests", async () => {});
    });

    test.describe("The cd-main catalog form", () => {
      test.skip("write cd-main catalog form tests", async () => {});
    });

    test.describe("The records form", () => {
      test.skip("write records form tests", async () => {});
    });

    test.describe("The tapes form", () => {
      test.skip("write tapes form tests", async () => {});
    });
  });

  test.describe("The Right col items", () => {
    test.skip("PUSH ME button is inert until there is an item in the list", async () => {});
    test.skip("PUSH ME button loads the last entry when pressed", async () => {});
    test.skip("INCREMENT LOCATION checkbox increments the location of the cd comps form", async () => {});
    test.skip("INCREMENT LOCATION checkbox shows error toast for the cd-singles form", async () => {});
    test.skip("INCREMENT LOCATION checkbox increments the location of the cd-main form", async () => {});
    test.skip("INCREMENT LOCATION checkbox increments the location of the records form", async () => {});
    test.skip("INCREMENT LOCATION checkbox increments the location of the tapes form", async () => {});
    test.skip("cd-comps form added item gets added to the session list", async () => {});
    test.skip("cd-singles form added item gets added to the session list", async () => {});
    test.skip("cd-main form added item gets added to the session list", async () => {});
    test.skip("records form added item gets added to the session list", async () => {});
    test.skip("tapes form added item gets added to the session list", async () => {});
  });
});
