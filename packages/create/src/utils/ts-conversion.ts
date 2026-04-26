import { copyFileSync, Dirent, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { rm } from "node:fs/promises";
import { transform } from "sucrase";
import { readFileToString, recurseFiles } from "./file-system";
import { JS_CONFIG } from "./constants";
