#!/usr/bin/env node
import inquirer from "inquirer";
import degit from "degit";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import chalk from "chalk";
import gradient, { pastel } from "gradient-string";
import figlet from "figlet";
import ora from "ora";

async function safePrompt(questions) {
    try {
        return await inquirer.prompt(questions);
    } catch (err) {
        if (err.name === "ExitPromptError") {
            console.log(); // newline for cleaner output
            const { confirmExit } = await inquirer.prompt([
                {
                    type: "confirm",
                    name: "confirmExit",
                    message: chalk.yellow("⚠️  Are you sure you want to quit?"),
                    default: true,
                },
            ]);

            if (confirmExit) {
                console.log(chalk.red("👋 Exiting setup..."));
                process.exit(0);
            } else {
                console.log(chalk.green("✅ Resuming setup..."));
                // retry original prompt
                return safePrompt(questions);
            }
        } else {
            throw err;
        }
    }
}

function updatePackageNames(targetDir, newName) {
    const packageJsonPath = path.join(targetDir, "package.json");
    const packageLockPath = path.join(targetDir, "package-lock.json");

    if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        pkg.name = newName;
        fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
        console.log(
            chalk.green(`📦 Updated package.json name to "${newName}"`)
        );
    }

    if (fs.existsSync(packageLockPath)) {
        const pkgLock = JSON.parse(fs.readFileSync(packageLockPath, "utf-8"));
        pkgLock.name = newName;
        fs.writeFileSync(packageLockPath, JSON.stringify(pkgLock, null, 2));
        console.log(
            chalk.green(`📦 Updated package-lock.json name to "${newName}"`)
        );
    }
}

function validateProjectName(name) {
    const regex = /^[a-z0-9][a-z0-9-_]*$/;

    if (!name) return "❌ Project name cannot be empty.";
    if (!regex.test(name)) {
        return "❌ Name must contain only lowercase letters, numbers, hyphens, or underscores, and start with a letter/number.";
    }
    if (name.length > 214)
        return "❌ Name cannot be longer than 214 characters.";

    return true;
}

async function pickTemplate(config, message = "Choose a template:") {
    const choices = Object.keys(config);

    const { choice } = await safePrompt([
        {
            type: "list",
            name: "choice",
            message: chalk.cyanBright(message),
            choices,
        },
    ]);

    const selected = config[choice];

    if (typeof selected === "string") {
        return selected;
    } else {
        return pickTemplate(selected, `Choose a ${choice} template:`);
    }
}

async function askProjectName() {
    while (true) {
        try {
            const { projectName } = await safePrompt([
                {
                    type: "input",
                    name: "projectName",
                    message: chalk.yellow("📛 Enter project name:"),
                    default: "my-project",
                    validate: validateProjectName,
                },
            ]);

            const targetDir = path.resolve(process.cwd(), projectName);

            if (fs.existsSync(targetDir)) {
                console.log(
                    chalk.red(
                        `❌ Folder "${projectName}" already exists. Please choose another name.\n`
                    )
                );
            } else {
                return { projectName, targetDir };
            }
        } catch (err) {
            // Catch ExitPromptError and trigger our SIGINT flow
            if (err.isTtyError || err.name === "ExitPromptError") {
                continue; // just ignore, SIGINT handler will ask
            }
            throw err;
        }
    }
}

const REPOS_JSON_URL =
    "https://raw.githubusercontent.com/aannaassalam/project-templates/refs/heads/master/repos.json";

async function fetchReposConfig() {
    try {
        const res = await fetch(REPOS_JSON_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(
            chalk.red("❌ Failed to fetch repo list from GitHub:"),
            err.message
        );
        process.exit(1);
    }
}

(async () => {
    // Banner
    console.log(
        pastel.multiline(
            figlet.textSync("Anas Project Setup", {
                font: "Big",
                horizontalLayout: "fitted",
            })
        )
    );
    console.log(chalk.gray("⚡ Supercharge your project setup\n"));

    const repos = await fetchReposConfig();

    const { projectName, targetDir } = await askProjectName();
    console.log(`✅ Using project name: ${chalk.green(projectName)}`);
    console.log(`📂 Target directory: ${chalk.cyan(targetDir)}`);

    const { category } = await safePrompt([
        {
            type: "list",
            name: "category",
            message: chalk.magentaBright(
                "📂 What type of project do you want to create?"
            ),
            choices: ["Frontend", "Backend"],
        },
    ]);

    let repoUrl = "";

    if (category === "Frontend" || category === "Backend") {
        repoUrl = await pickTemplate(repos[category.toLowerCase()]);
    }

    const spinner = ora(
        `📥 Downloading template into ${chalk.cyan(targetDir)}...`
    ).start();
    try {
        const emitter = degit(repoUrl);
        await emitter.clone(targetDir);
        spinner.succeed("✅ Template downloaded!");
    } catch (err) {
        spinner.fail("❌ Failed to clone repo");
        console.error(err);
        process.exit(1);
    }

    updatePackageNames(targetDir, projectName);

    console.log(
        chalk.greenBright(
            `\n✨ Done! Your project is ready in '${projectName}'`
        )
    );
    console.log(chalk.cyanBright(`\n\n\n➡ cd ${projectName}`));
    console.log(chalk.cyanBright("➡ npm install / yarn install"));
    console.log(chalk.cyanBright("➡ Start building 🚀\n"));
})();
