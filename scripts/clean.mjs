import { rm } from "node:fs/promises";

// Only generated output is removed. A clean build cannot publish stale files.
await rm(new URL("../_site/", import.meta.url), { recursive: true, force: true });
