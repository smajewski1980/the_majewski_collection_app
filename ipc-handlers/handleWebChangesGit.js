const { execFileSync, execFile } = require("child_process");
const path = require("path");
const { app } = require("electron/main");

function handleWebChangesGit() {
  // Path to your neighbor Web App project folder
  const webAppFolder = path.resolve(
    app.getPath("desktop"),
    "tmc",
    "my_music_collection_v3",
  );

  const execOptions = {
    cwd: webAppFolder,
    encoding: "utf-8",
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  };

  try {
    // 1. Check if the Electron JSON output created any changes
    const status = execFileSync("git", ["status", "--porcelain"], execOptions);

    // if there are local commits that havent been pushed
    const isCherry = execFileSync("git", ["cherry"], execOptions);
    if (!status.trim() && isCherry) {
      execFileSync("git", ["push"], execOptions);
      console.log(
        "🎉 Push of leftover commits was successful! CI/CD deployment triggered.",
      );
      return "🎉 Push of leftover commits was successful! CI/CD deployment triggered.";
    }

    if (!status.trim()) {
      console.log("✅ No data changes detected. CI/CD trigger skipped.");
      return "✅ No data changes detected. CI/CD trigger skipped.";
    }

    console.log("📦 Staging updated JSON files...");
    execFileSync("git", ["add", "*.json"], execOptions);

    console.log("✍️ Creating automated commit...");
    const commitMessage = `data: automated json update [${new Date().toISOString()}]`;
    execFileSync("git", ["commit", "-m", commitMessage], execOptions);

    console.log("🚀 Pushing to remote to trigger CI/CD pipeline...");
    execFileSync("git", ["push"], execOptions);

    console.log("🎉 Push successful! CI/CD deployment triggered.");
    return 1;
  } catch (error) {
    console.error("❌ Automated Git sync failed!");
    console.error("Details:", error.stderr || error.message);
    return `Details:, ${error.stderr || error.message}`;
  }
}

module.exports = handleWebChangesGit;

// maybe set up a backend func to send live logs
//    to the frontend so we can toast the above logs
