#!/usr/bin/env node
import inquirer from "inquirer";
import degit from "degit";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";

const REPOS_JSON_URL =
    "https://raw.githubusercontent.com/aannaassalam/project-templates/main/repos.json";

async function fetchReposConfig() {
    try {
        const res = await fetch(REPOS_JSON_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("❌ Failed to fetch repo list from GitHub:", err.message);
        process.exit(1);
    }
}

(async () => {
    console.log("🚀 Project Initializer CLI\n");

    const repos = await fetchReposConfig();

    const { category } = await inquirer.prompt([
        {
            type: "list",
            name: "category",
            message: "Which type of project do you want to create?",
            choices: ["Frontend", "Backend"],
        },
    ]);

    let repoUrl = "";

    if (category === "Frontend" || category === "Backend") {
        const templates = repos[category.toLowerCase()];
        const { templateChoice } = await inquirer.prompt([
            {
                type: "list",
                name: "templateChoice",
                message: `Choose a ${category} template:`,
                choices: Object.keys(templates),
            },
        ]);
        repoUrl = templates[templateChoice];
    }

    //   if (category === "Custom GitHub URL") {
    //     const { customUrl } = await inquirer.prompt([
    //       {
    //         type: "input",
    //         name: "customUrl",
    //         message: "Enter the GitHub repo URL:",
    //         validate: input => input.startsWith("https://github.com/") || "Must be a valid GitHub URL"
    //       }
    //     ]);
    //     repoUrl = customUrl;
    //   }

    const { folderName } = await inquirer.prompt([
        {
            type: "input",
            name: "folderName",
            message: "Enter folder name to clone into:",
            default: "my-project",
        },
    ]);

    const targetDir = path.resolve(process.cwd(), folderName);
    if (fs.existsSync(targetDir)) {
        console.error("❌ Folder already exists. Choose another name.");
        process.exit(1);
    }

    console.log(`📥 Downloading template into ${targetDir}...`);
    const emitter = degit(repoUrl);
    await emitter.clone(targetDir);

    //   const { reInit } = await inquirer.prompt([
    //     {
    //       type: "confirm",
    //       name: "reInit",
    //       message: "Do you want to remove existing Git history and start fresh?",
    //       default: false
    //     }
    //   ]);

    //   if (reInit) {
    //     fs.rmSync(path.join(targetDir, ".git"), { recursive: true, force: true });
    //     const gitNew = simpleGit(targetDir);
    //     await gitNew.init();
    //     await gitNew.add(".");
    //     await gitNew.commit("Initial commit from CLI");
    //     console.log("🔧 Git re-initialized successfully.");
    //   }

    console.log(`✅ Done! Your project is ready in '${folderName}'`);
})();
