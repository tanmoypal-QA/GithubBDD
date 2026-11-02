// Cucumber loads the TypeScript hooks and step definitions through ts-node.
module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    requireModule: ["ts-node/register"],
    require: ["hooks/**/*.ts", "step-definitions/**/*.ts"],
    publishQuiet: true,
    formatOptions: {
      snippetInterface: "async-await"
    }
  }
};
