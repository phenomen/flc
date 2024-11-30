/** @type {import("prettier").Config} */
export default {
	useTabs: true,
	singleQuote: false,
	trailingComma: "none",
	printWidth: 100,
	quoteProps: "consistent",
	singleAttributePerLine: true,
	bracketSameLine: true,
	plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	tailwindFunctions: ["clsx", "cn"],
	overrides: [
		{
			files: "*.svelte",
			options: {
				parser: "svelte"
			}
		}
	]
};
