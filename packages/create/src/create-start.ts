import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { downloadRepo, GithubFetcher } from "@solidb-cli/gitcore";
import { GIT_IGNORE, StartTemplate, StartTemplateV2 } from "./utils/constants";
import { handleTSConversion } from "./utils/ts-conversion";

export type CreateStartArgs = {
	template: StartTemplate | StartTemplateV2;
	destination: string;
};

export const createStartTS = ({ template, destination }: CreateStartArgs, v2?: boolean) => {
	const subdir = v2 ? `solid-start-v2/${template}` : `solid-start-v1/${template}`;

	return downloadRepo(
		{
			repo: { owner: "solidjs", name: "templates", subdir },
			dest: destination,
		},
		GithubFetcher,
	);
};

export const createStartJS = async ({ template, destination }: CreateStartArgs, v2?: boolean) => {
	// Create typescript project in `<destination>/.project`
	// then transpile this to javascript and clean up
	const tempDir = join(destination, ".project");
	await createStartTS({ template, destination: tempDir }, v2);
	console.log("模板下载啦...\n\n");
	await handleTSConversion(tempDir, destination);
	// Add .gitignore
	console.log(join(destination, ".gitignore"));
	writeFileSync(join(destination, ".gitignore"), GIT_IGNORE);
};

export const createStart = (args: CreateStartArgs, transpile?: boolean, v2?: boolean) => {
	if (transpile) {
		return createStartJS(args, v2);
	}
	return createStartTS(args, v2);
};
