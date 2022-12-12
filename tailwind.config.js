/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontSize: {
				nav: "11.6px",
				input: "12px",
			},
			colors: {
				"overlay-bg": "rgba(0, 0, 0, 0.6)",
				"warning": "#4B2B09",
				"warning-text": "#F78F1E",
				"blue": "#6366F1",
				"blue-dark": "#1E1F48",
				"input-bg": "#1C1C1C",
				"light-blue": "#141430",
				"light-pink": "#C1C2F9",
				"off-white": "#B4B4B4",
				"grey-100": "#DADADA",
				"grey-200": "#B4B4B4",
				"grey-300": "#8F8F8F",
				"grey-400": "#696969",
				"grey-700": "#303030",
				"grey-950": "#121212",
				"grey-900": "#1C1C1C",

				// -- Brand Colours --
				"brand-secondary-500": "#6366F1",
				"brand-secondary-900": "#1E1F48",
			},
		},
	},
	plugins: [],
};
