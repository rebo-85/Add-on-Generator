import { PackGenerator } from "../classes.js";

export class ResourcePackGenerator extends PackGenerator {
  constructor(options) {
    options.type = "resources";
    super(options);
  }
}
