const { execFileSync, execFile } = require("child_process");
const path = require("path");
const { app } = require("electron/main");
const util = require("util");
// Convert execFile from callback-based to Promise-based
const execFileAsync = util.promisify(execFile);

// let msg = [];
// let isDone = false;

async function handleWebChangesGit(e) {
  // isDone = false;
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

  // Helper function to send messages instantly
  const sendLog = async (message) => {
    console.log("From main js:", message);
    e.sender.send("toast-message-received", message);
    await flushIPC();
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
      // msg.push(successMsg);
      // isDone = true;
      return;
    }

    if (!status.trim()) {
      await sendLog("✅ No data changes detected. CI/CD trigger skipped.");
      await sendLog("MESSAGE COMPLETE");
      // isDone = true;
      return;
    }

    await sendLog("📦 Staging updated JSON files...");
    // msg.push("📦 Staging updated JSON files...");
    await execFileAsync("git", ["add", "*.json"], execOptions);

    await sendLog("✍️ Creating automated commit...");
    // msg.push("✍️ Creating automated commit...");
    const commitMessage = `data: automated json update [${new Date().toISOString()}]`;
    await execFileAsync("git", ["commit", "-m", commitMessage], execOptions);

    await sendLog("🚀 Pushing to remote to trigger CI/CD pipeline...");
    // msg.push("🚀 Pushing to remote to trigger CI/CD pipeline...");
    await execFileAsync("git", ["push"], execOptions);

    await sendLog("🎉 Push successful! CI/CD deployment triggered.");
    // msg.push("🎉 Push successful! CI/CD deployment triggered.");
    // isDone = true;
    await sendLog("MESSAGE COMPLETE");
  } catch (error) {
    console.error("❌ Automated Git sync failed!");
    // msg.push(
    //   `❌ Automated Git sync failed!\n"Details:"\n${error.stderr || error.message}`,
    // );
    // sendLog("Details:", error.stderr || error.message);
    // sendLog("MESSAGE COMPLETE");
    const errorMessage = `❌ Automated Git sync failed! Details: ${error.stderr || error.message}`;

    await sendLog(errorMessage);
    await sendLog("MESSAGE COMPLETE");
    // isDone = true;
    // return `Details:, ${error.stderr || error.message}`;
  }
  // finally {
  //   isDone = true;
  // }
}

// function gitServerToast(messageSender) {
//   const int = setInterval(() => {
//     if (msg.length > 0) {
//       messageSender(msg.shift());
//     } else if (isDone) {
//       clearInterval(int);
//       messageSender("MESSAGE COMPLETE");
//     }
//   }, 500);
// }

module.exports = { handleWebChangesGit };
