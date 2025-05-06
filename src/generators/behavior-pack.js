import { PackGenerator } from "../classes.js";
import { server_version, server_ui_version } from "../constants.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

export class BehaviorPackGenerator extends PackGenerator {
  constructor(options) {
    options.type = "data";
    super(options);
  }

  initScript(scriptMainFile) {
    if (!this.manifest) throw new Error("Manifest not generated yet. Call initManifest() first.");

    if (this.manifest.modules.some((module) => module.type === "script")) return;

    if (!this.manifest.dependencies) this.manifest.dependencies = [];

    this.manifest.modules.push({
      type: "script",
      entry: `scripts/${scriptMainFile}`,
      language: "javascript",
      version: [1, 0, 0],
      uuid: uuidv4(),
    });
    this.manifest.dependencies.push(
      {
        module_name: "@minecraft/server",
        version: server_version,
      },
      {
        module_name: "@minecraft/server-ui",
        version: server_ui_version,
      }
    );

    const scriptGenerator = (packPath) => {
      try {
        const scriptPath = path.join(packPath, "scripts");
        if (!fs.existsSync(scriptPath)) fs.mkdirSync(scriptPath, { recursive: true });
        fs.writeFileSync(path.join(scriptPath, scriptMainFile), `console.log('${this.name} scripts loaded.');`);
      } catch (error) {
        console.error(`Failed to create texts directory in ${packPath}:`, error);
      }
    };
    this.generator.set("lang", scriptGenerator);
  }
}
