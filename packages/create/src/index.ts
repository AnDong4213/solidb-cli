import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { getTemplatesList, GIT_IGNORE, isValidTemplate, PROJECT_TYPES, ProjectType } from "./utils/constants";
import { cancelable, spinnerify } from "@solidb-cli/utils/ui";

export const createSolidb = (version: string) => {
	return defineCommand({
		meta: {
			name: "create-solidb",
			description: "A CLI for scaffolding new Solid projects",
			version: version,
		},
		args: {
			"projectNamePositional": {
				type: "positional",
				required: false,
				description: "Project name",
			},
			"templatePositional": {
				type: "positional",
				required: false,
				description: "Template name",
			},
			"project-name": {
				type: "string",
				required: false,
				alias: "p",
				description: "Project name",
			},
			"template": {
				type: "string",
				required: false,
				alias: "t",
				description: "Template name",
			},
			"solidstart": {
				type: "boolean",
				required: false,
				alias: "s",
				description: "Create a SolidStart project",
			},
			"v2": {
				type: "boolean",
				required: false,
				description: "Create a SolidStart v2 project",
			},
			"library": {
				type: "boolean",
				required: false,
				alias: "l",
				description: "Create a Library project",
			},
			"vanilla": {
				type: "boolean",
				required: false,
				alias: "v",
				description: "Create a vanilla (SolidJS + Vite) project",
			},
			"ts": {
				type: "boolean",
				required: false,
				description: "Use typescript",
			},
			"js": {
				type: "boolean",
				required: false,
				description: "Use javascript",
			},
		},
		async run(params) {
			console.log(params.args);
			const {
				projectNamePositional,
				templatePositional,
				"project-name": projectNameOptional,
				"template": templateOptional,
				solidstart,
				library,
				vanilla,
				ts,
				js,
				v2,
			} = params.args;

			// Show prompts for any unknown arguments
			let projectName = projectNamePositional ?? projectNameOptional;
			let template = templatePositional ?? templateOptional;
			let projectType: ProjectType | undefined = solidstart
				? "start"
				: vanilla
					? "vanilla"
					: library
						? "library"
						: undefined;
			// False if user has selected ts, true if they have selected js, and undefined if they've done neither
			let useJS = ts ? !ts : js ? js : undefined;
			projectName ??= await cancelable(
				p.text({
					message: "Project Name",
					placeholder: "solid-project",
					defaultValue: "solidb-project",
				}),
			);
			console.log("projectName--", projectName);
			projectType ??= await cancelable(
				p.select({
					message: "What type of project would you like to create?",
					initialValue: "start",
					options: PROJECT_TYPES.map((t) => ({
						value: t,
						label: t === "start" ? "SolidStart" : t === "vanilla" ? "SolidJS + Vite" : "Library",
					})),
				}),
			);
			console.log("projectType--", projectType);
			if (!projectType) return;

			let useV2: string | undefined;
			if (projectType === "start") {
				useV2 = v2
					? "v2"
					: await cancelable(
							p.select({
								message: "Which version of SolidStart?",
								initialValue: "v2",
								options: [
									{ value: "v2", label: "v2 (pre-release, recommended)" },
									{ value: "v1", label: "v1 (stable)" },
								],
							}),
						);
			}

			const isV2 = useV2 === "v2";

			// Don't offer javascript if `projectType` is library
			useJS ??= projectType === "library" ? false : !(await cancelable(p.confirm({ message: "Use Typescript?" })));

			if (!projectType) return;

			const template_opts = getTemplatesList(projectType, isV2);
			// console.log("template_opts--", template_opts);
			template ??= await cancelable(
				p.select({
					message: "Which template would you like to use?",
					initialValue: "basic",
					options: template_opts
						.filter((s) => (useJS ? s : !s.startsWith("js")))
						.map((s: string) => ({ label: s, value: s })),
				}),
			);
			if (!template) return;

			// Need to transpile if the user wants Jabascript, but their selected template isn't Javascript
			const transpileToJS = useJS && !template.startsWith("js");
			if (projectType === "start" && isValidTemplate("start", template, isV2)) {
			} else if (projectType === "library" && isValidTemplate("library", template)) {
			} else if (projectType === "vanilla" && isValidTemplate(projectType, template)) {
			} else {
				p.log.error(`Template ${template} is not valid for project type ${projectType}`);
				process.exit(0);
			}
		},
	});
};
