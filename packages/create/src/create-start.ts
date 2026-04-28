import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { downloadRepo, GithubFetcher } from "@solidb-cli/gitcore";
import { GIT_IGNORE, StartTemplate, StartTemplateV2 } from "./utils/constants";

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
