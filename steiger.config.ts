import fsd from "@feature-sliced/steiger-plugin";

export default [
	...fsd.configs.recommended,
	{
		files: ["./src/widgets/layout-admin/**"],
		rules: {
			"fsd/insignificant-slice": "off",
		},
	},
	{
		files: ["./src/app/routes/**"],
		rules: {
			"fsd/no-reserved-folder-names": "off",
		},
	},
	{
		files: [
			"./src/shared/auth/**",
			"./src/shared/db/**",
			"./src/shared/logging/**",
			"./src/shared/media/**",
		],
		rules: {
			"fsd/no-reserved-folder-names": "off",
		},
	},
	{
		files: ["./src/shared/ui/**"],
		rules: {
			"fsd/public-api": "off",
		},
	},
];
