# Delete Ghost Scripts Plugin
If an entry point only contains non-js files that will be extracted by a loader or plugin, webpack will still generate an empty script (where the content was supposed to be). This webpack plugin removes that script.

This utility is extremely useful when using plugins like [MiniCssExtractPlugin](https://github.com/webpack-contrib/mini-css-extract-plugin), which extract files that otherwise would be directly added to the script entry chunk script, and thus creating that ghost script.

## Usage

The plugin needs no configuration at all. It will go through your entry chunks and remove the scripts created by those who only import non-js files, while keeping the files that are really needed.

### Example
```js
module.exports = {
		entry: {
			index: [
				"scripts/index.js",
				"styles/index.css"
			],
			about: "styles/about.css"
		},
		module: {
			rules: [
				...
				{
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, "css-loader"]
				}
			]
		},
		plugins: [
			...
			new MiniCssExtractPlugin({
				filename: `styles/[name].css`
			}),
			new DeleteGhostScriptsPlugin()
		]
	};
```

### File Tree
```
src/
 ├── pages/
 │    ├── about.html
 │    └── index.html
 ├── scripts/
 │    └── index.js
 └── styles/
      ├── about.css
      └── index.css
webpack.config.js
```

##### When Compiled
- There will be no `about.js` in **dist/scripts/**