import { v4 as uuidv4 } from "uuid";
import { min_engine_version } from "./constants.js";
import path from "path";
import fs from "fs";

class PackGeneratorOptions {
  constructor(name, description, authors, type = null, dependencyUuid = null) {
    this.name = name;
    this.description = description;
    this.authors = authors;
    this.type = type;
    this.dependencyUuid = dependencyUuid;
  }
}

export class PackGenerator {
  constructor(options) {
    const { name, description, authors, type, dependencyUuid } = options;
    this.uuid = uuidv4();
    this.name = name;
    this.description = description;
    this.authors = authors;
    this.type = type;
    this.dependencyUuid = dependencyUuid;
    this.generator = new Map();
  }

  initManifest() {
    if (this.manifest) return;
    const dependencies = [];

    if (this.dependencyUuid) {
      dependencies.push({
        uuid: this.dependencyUuid,
        version: [1, 0, 0],
      });
    }

    this.manifest = {
      format_version: 2,
      header: {
        name: "pack.name",
        description: "pack.description",
        uuid: this.uuid,
        version: [1, 0, 0],
        min_engine_version,
      },
      metadata: {
        authors: ["pack.authors"],
      },
      modules: [
        {
          description: "pack.description",
          version: [1, 0, 0],
          uuid: uuidv4(),
          type: this.type,
        },
      ],
    };

    if (dependencies.length > 0) this.manifest.dependencies = dependencies;

    const manifestGenerator = (packPath) => {
      try {
        const manifestPath = path.join(packPath, "manifest.json");
        if (!fs.existsSync(packPath)) fs.mkdirSync(packPath, { recursive: true });
        fs.writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2));
      } catch (error) {
        console.error(`Failed to generate manifest.json in ${packPath}:`, error);
      }
    };
    this.generator.set("manifest", manifestGenerator);
  }

  initLang() {
    if (this.lang) return;
    this.lang = `
  pack.name=${this.name}
  pack.description=${this.description}
  pack.authors=${this.authors.join(", ")}`;

    const langGenerator = (packPath) => {
      try {
        const langPath = path.join(packPath, "texts");
        if (!fs.existsSync(langPath)) fs.mkdirSync(langPath, { recursive: true });
        fs.writeFileSync(path.join(langPath, "en_US.lang"), this.lang.trim());
      } catch (error) {
        console.error(`Failed to create texts directory in ${packPath}:`, error);
      }
    };
    this.generator.set("lang", langGenerator);
  }

  generateFiles(packPath) {
    if (!this.manifest) throw new Error("Manifest not initialized. Call initManifest() first.");
    for (const generator of this.generator.values()) {
      generator(packPath);
    }
  }
}
