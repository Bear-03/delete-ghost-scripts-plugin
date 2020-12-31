const IgnoreEmitWebpackPlugin = require("ignore-emit-webpack-plugin");

/**
 * Will remove any empty .js files that webpack may generate due to entry chunks
 * that only contain non-js files.
 */
class DeleteGhostScriptsPlugin extends IgnoreEmitWebpackPlugin {
	/**
	 * @param {String|String[]} ignoreExtensions - Array of extensions to ignore.
	 */
	constructor(ignoreExtensions) {
		/* This regex pattern matches nothing. It will be replaced,
		but the parent plugin throws an error if nothing is passed */
		super(/$./);
		this.ignoreExtensions = [".js"];
		if (ignoreExtensions) this.ignoreExtensions = this.ignoreExtensions.concat(ignoreExtensions);
	}

	apply(compiler) {
		compiler.hooks.entryOption.tap("DeleteGhostScriptsPlugin", (_, entry) => {
			const filesToRemove = [];

			for (const [name, chunk] of Object.entries(entry)) {
				// If the chunk only contains non-js files
				if (!chunk.import.some(path => { return this.endsWithAny(path, this.ignoreExtensions); })) {
					/* All files that contain the given name and are .js files*/
					filesToRemove.push(new RegExp(`.*(${name}).*\\.js$`));
				}
			}

			// This is how it's done in the parent plugin (check its src code)
			super.ignorePatterns = super.normalizeRegex(filesToRemove);
		});

		super.apply(compiler);
	}

	/**
	 * Check if string ends with any extension in an array
	 * @param {String} string - String that will be checked
	 * @param {String[]} extensions - Array of extensions used to check
	 */
	endsWithAny(string, extensions) {
		return extensions.some(ext => { return string.endsWith(ext); });
	}
}

module.exports = DeleteGhostScriptsPlugin;