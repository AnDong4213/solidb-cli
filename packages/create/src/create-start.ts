import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { downloadRepo, GithubFetcher } from "@solidb-cli/gitcore";
import { GIT_IGNORE, StartTemplate, StartTemplateV2 } from "./utils/constants";

export type CreateStartArgs = {
	template: StartTemplate | StartTemplateV2;
	destination: string;
};
