import { test, expect, _electron as electron } from "@playwright/test";

test.describe("HOMEPAGE", () => {
  test("Application launches and loads UI", async () => {
    // Launch the Electron application pointing to your main entry file (e.g., main.js)
    const electronApp = await electron.launch({ args: ["./main.js"] });

    // Wait for the first BrowserWindow to open
    const page = await electronApp.firstWindow();

    const button = page.getByRole("button", { name: "UPDATE WEB CATALOG" });
    const lookupLink = page.getByRole("link", { name: "LOOKUP" });
    const addLink = page.getByRole("link", { name: "ADD ITEMS" });
    const updateLink = page.getByRole("link", { name: "UPDATE ITEMS" });

    await expect(page).toHaveTitle("The Majewski Collection App");
    await expect(button).toBeVisible();
    await expect(lookupLink).toBeVisible();
    await expect(addLink).toBeVisible();
    await expect(updateLink).toBeVisible();

    await lookupLink.click();
    await expect(page).toHaveTitle("The Majewski Collection Lookup");
    // Close the app at the end of the test
    await electronApp.close();
  });
});
