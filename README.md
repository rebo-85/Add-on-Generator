# Minecraft Bedrock Add-on Generator

This project is a JavaScript-based tool for generating Minecraft Bedrock add-ons, including both behavior packs and resource packs. It simplifies the process of creating and managing add-ons for Minecraft by providing a structured approach to generating the necessary files and directories.

## Project Structure

```
minecraft-addon-generator
├── src
│   ├── index.js               # Entry point of the application
│   ├── generators
│   │   ├── behavior-pack.js   # Generator for behavior packs
│   │   └── resource-pack.js    # Generator for resource packs
├── package.json                # NPM configuration file
├── .eslintrc.json             # ESLint configuration
├── .gitignore                  # Git ignore file
└── README.md                   # Project documentation
```

## Installation

To get started with the Minecraft Bedrock Add-on Generator, clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/minecraft-addon-generator.git
cd minecraft-addon-generator
npm install
```

## Usage

To generate a new Minecraft Bedrock add-on, run the following command:

```bash
node src/index.js
```

Follow the prompts to create your behavior and resource packs.

## Generators

### Behavior Pack Generator

The `BehaviorPackGenerator` class is responsible for creating the structure of a behavior pack and adding specific behavior files. 

### Resource Pack Generator

The `ResourcePackGenerator` class handles the creation of a resource pack structure and the addition of resource files.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.