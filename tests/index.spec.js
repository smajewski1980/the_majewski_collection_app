import { test, expect, _electron as electron } from "@playwright/test";

test.describe("HOMEPAGE", () => {
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

  test.skip("test the output of the update web catalog button", async () => {});
});
