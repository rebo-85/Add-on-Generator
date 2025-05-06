import inquirer from "inquirer";
import { BehaviorPackGenerator } from "./generators/behavior-pack.js";
import { ResourcePackGenerator } from "./generators/resource-pack.js";
import fs from "fs";
import path from "path";

async function main() {
  const { packName, packDescription, packAuthors, packType, outputDir, includeScriptModules, scriptMainFile } =
    await inquirer.prompt([
      {
        type: "input",
        name: "packName",
        message: "What should your add-on be called?",
        validate: (input) => input.trim() !== "" || "Add-on name cannot be empty.",
      },
      {
        type: "input",
        name: "packDescription",
        message: "Provide a description for your add-on:",
        default: (answers) => `${answers.packName} Add-on`,
      },
      {
        type: "input",
        name: "packAuthors",
        message: "Who are the authors of this add-on? (comma-separated)",
        default: "Unknown Author",
        filter: (input) => input.split(",").map((author) => author.trim()),
      },
      {
        type: "list",
        name: "packType",
        message: "Which type of pack do you want to generate?",
        choices: ["Behavior Pack", "Resource Pack", "Both"],
      },
      {
        type: "confirm",
        name: "includeScriptModules",
        message: "Do you want to include necessary script modules in the Behavior Pack?",
        default: false,
        when: (answers) => answers.packType === "Behavior Pack" || answers.packType === "Both",
      },
      {
        type: "input",
        name: "scriptMainFile",
        message: "What is the name of the main script file?",
        default: "main.js",
        when: (answers) => answers.includeScriptModules,
        validate: (input) => input.trim() !== "" || "Script file name cannot be empty.",
        filter: (input) => (input.trim().endsWith(".js") ? input.trim() : `${input.trim()}.js`),
      },
      {
        type: "input",
        name: "outputDir",
        message: "Specify the output directory for the generated files:",
        default: "./output",
      },
    ]);

  const outputPath = path.resolve(outputDir);
  fs.mkdirSync(outputPath, { recursive: true });

  if (packType === "Both") {
    const bpg = new BehaviorPackGenerator({
      name: packName,
      description: packDescription,
      authors: packAuthors,
    });

    const rpg = new ResourcePackGenerator({
      name: packName,
      description: packDescription,
      authors: packAuthors,
    });

    bpg.dependencyUuid = rpg.uuid;
    rpg.dependencyUuid = bpg.uuid;

    bpg.initManifest();
    rpg.initManifest();
    bpg.initLang();
    rpg.initLang();

    if (includeScriptModules) bpg.initScript(scriptMainFile);

    const behaviorPackPath = path.join(outputPath, `${packName} BP`);
    const resourcePackPath = path.join(outputPath, `${packName} RP`);

    bpg.generateFiles(behaviorPackPath);
    rpg.generateFiles(resourcePackPath);

    console.log(`Behavior Pack and Resource Pack generated in ${outputPath}`);
  } else if (packType === "Behavior Pack") {
    const bpg = new BehaviorPackGenerator({
      name: packName,
      description: packDescription,
      authors: packAuthors,
    });

    bpg.initManifest();
    bpg.initLang();

    if (includeScriptModules) bpg.initScript(scriptMainFile);

    const behaviorPackPath = path.join(outputPath, `${packName} BP`);

    bpg.generateFiles(behaviorPackPath);

    console.log(`Behavior Pack generated in ${behaviorPackPath}`);
  } else if (packType === "Resource Pack") {
    const rpg = new ResourcePackGenerator({
      name: packName,
      description: packDescription,
      authors: packAuthors,
    });

    rpg.initManifest();
    rpg.initLang();

    const resourcePackPath = path.join(outputPath, `${packName} RP`);

    rpg.generateFiles(resourcePackPath);

    console.log(`Resource Pack generated in ${resourcePackPath}`);
  }
}

main().catch((err) => {
  console.error("Error generating pack:", err);
});
