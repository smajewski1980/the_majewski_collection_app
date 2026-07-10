const { execFileSync, execFile } = require("child_process");
const path = require("path");
const { app } = require("electron/main");
const util = require("util");
// Convert execFile from callback-based to Promise-based
const execFileAsync = util.promisify(execFile);

async function handleWebChangesGit(e) {
  // Helper function to send messages instantly
  const sendLog = async (message) => {
    console.log("From main js:", message);
    e.sender.send("toast-message-received", message);
    await flushIPC();
  };

  if (process.env.TEST_OUTPUT_PATH) {
    console.log("THIS IS A TEST, NO GIT COMMANDS WERE RUN");
    await sendLog("MESSAGE COMPLETE");
    return;
  }

  // Path to your neighbor Web App project folder
  const webAppFolder = path.resolve(
    app.getPath("desktop"),
    "tmc",
    "my_music_collection_v3",
  );

  // Helper to force the main thread to flush IPC messages to the frontend instantly
  const flushIPC = () => new Promise((resolve) => setTimeout(resolve, 10));

  const execOptions = {
    cwd: webAppFolder,
    encoding: "utf-8",
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  };

  try {
    // 1. Check if the Electron JSON output created any changes
    const { stdout: status } = await execFileAsync(
      "git",
      ["status", "--porcelain"],
      execOptions,
    );

    // if there are local commits that havent been pushed
    const { stdout: isCherry } = await execFileAsync(
      "git",
      ["cherry"],
      execOptions,
    );

    if (!status.trim() && isCherry) {
      await sendLog("🚀 Found leftover commits. Pushing now...");
      await execFileAsync("git", ["push"], execOptions);
      await sendLog(
        "🎉 Push of leftover commits was successful! CI/CD deployment triggered.",
      );
      await sendLog("MESSAGE COMPLETE");
      return;
    }

    if (!status.trim()) {
      await sendLog("✅ No data changes detected. CI/CD trigger skipped.");
      await sendLog("MESSAGE COMPLETE");
      return;
    }

    await sendLog("📦 Staging updated JSON files...");
    await execFileAsync("git", ["add", "*.json"], execOptions);

    await sendLog("✍️ Creating automated commit...");
    const commitMessage = `data: automated json update [${new Date().toISOString()}]`;
    await execFileAsync("git", ["commit", "-m", commitMessage], execOptions);

    await sendLog("🚀 Pushing to remote to trigger CI/CD pipeline...");
    await execFileAsync("git", ["push"], execOptions);

    await sendLog("🎉 Push successful! CI/CD deployment triggered.");
    await sendLog("MESSAGE COMPLETE");
  } catch (error) {
    console.error("❌ Automated Git sync failed!");
    const errorMessage = `❌ Automated Git sync failed! Details: ${error.stderr || error.message}`;

    await sendLog(errorMessage);
    await sendLog("MESSAGE COMPLETE");
  }
}

module.exports = { handleWebChangesGit };
