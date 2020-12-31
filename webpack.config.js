const path = require("path");
const DeleteGhostScriptsPlugin = require(".");

const DynamicHtmlWebpackPlugin = require("dynamic-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_, options) => {
	const devmode = options.mode === "development";
	return {
		// Entries for specific html files must be named as the html file.
		entry: {
			index: [
				"scripts/index.js",
				"styles/index.css"
			],
			about: "styles/about.css"
		},
		output: {
			path: path.resolve(__dirname, "test/dist"),
			filename: "scripts/[name].bundle.js"
		},
		resolve: {
			alias: {
				src: path.resolve(__dirname, "test/src"),
				scripts: path.resolve(__dirname, "test/src/scripts"),
				styles: path.resolve(__dirname, "test/src/styles")
			}
		},
		module: {
			rules: [
				{
					test: /\.html$/,
					loader: "html-loader"
				},
				{
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, "css-loader"]
				}
			]
		},
		plugins: [
			new DynamicHtmlWebpackPlugin({
				dir: "test/src/pages"
			}),
			new MiniCssExtractPlugin({
				filename: "styles/[name].css"
			}),
			new DeleteGhostScriptsPlugin()
		],
		optimization: {
			minimize: !devmode,
		}
	};
};