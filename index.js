const IgnoreEmitWebpackPlugin = require("ignore-emit-webpack-plugin");

/**
 * Will remove any empty .js files that webpack may generate due to entry chunks
 * that only contain non-js files.
 */
class DeleteGhostScriptsPlugin extends IgnoreEmitWebpackPlugin {
	/**
	 * @param {String|String[]} handledExtensions? - Array of extensions that will make
	 * the plugin delte the .js file if the entry chunk doesn't import one.
	 */
	constructor(handledExtensions) {
		/* This regex pattern matches nothing. It will be replaced,
		but the parent plugin throws an error if nothing is passed */
		super(/$./);
		this.handledExtensions = [].concat(handledExtensions);
	}

	apply(compiler) {
		compiler.hooks.entryOption.tap("DeleteGhostScriptsPlugin", (_, entry) => {
			const filesToRemove = [];

			for (const [name, chunk] of Object.entries(entry)) {
				if (!this.chunkNeedsScript(chunk)) {
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

	/**
	 * Returns if the entry chunk needs a .js file.
	 * @param {{}} chunk - chunk whose imports will be checked.
	 */
	chunkNeedsScript(chunk) {
		if (this.handledExtensions) {
			let hasHandledFile = false;

			for (const file of chunk.import) {
				if (file.endsWith(".js")) return true;
				if (this.endsWithAny(file, this.handledExtensions)) hasHandledFile = true;
			}
			// It has no scripts. If it doesn't have a handled file, it needs one.
			return !hasHandledFile;
		}
		else return chunk.import.some(path => { return path.endsWith(".js"); });
	}
}

module.exports = DeleteGhostScriptsPlugin;