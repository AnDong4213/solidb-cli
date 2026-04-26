#! /usr/bin/env node

import { runMain } from "citty";
import { createSolidb } from "@solidb-cli/create";
import { intro } from "@clack/prompts";
import color from "picocolors";
import packageJson from "../package.json" with { type: "json" };

intro(`\n${color.bgCyan(color.gray(` Create-Solidb v${packageJson.version}`))}`);

runMain(createSolidb(packageJson.version));
