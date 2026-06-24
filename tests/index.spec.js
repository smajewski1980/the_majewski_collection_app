import { test, expect, _electron as electron } from "@playwright/test";

test("Application launches and loads UI", async () => {
  // Launch the Electron application pointing to your main entry file (e.g., main.js)
  const electronApp = await electron.launch({ args: ["./main.js"] });

  // Wait for the first BrowserWindow to open
  const window = await electronApp.firstWindow();

  const title = await window.title();

  expect(title).toBe("The Majewski Collection App");

  // Close the app at the end of the test
  await electronApp.close();
});
