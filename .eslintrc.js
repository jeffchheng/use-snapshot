module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
		jest: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:react/recommended",
	],
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly"
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: "module",
	},
	plugins: [
		"react",
		"react-hooks",
		"@typescript-eslint",
	],
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		"@typescript-eslint/no-unused-vars": "error",
		"comma-dangle": ["error", "always-multiline"],
		"no-unused-vars": "off",
		"no-unreachable": "error",
		"quotes": ["error", "double", { "avoidEscape": true }],
		"semi": ["error", "always"],
		"react/react-in-jsx-scope": "off",
		"react/jsx-fragments": "warn",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",
  }
}
