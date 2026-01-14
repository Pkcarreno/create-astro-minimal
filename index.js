#!/usr/bin/env node
import { rm } from "node:fs/promises";
import path from "node:path";
import { downloadTemplate } from "giget";
import pc from "picocolors";
import { replaceInFile } from "replace-in-file";

const projectName = process.argv[2];

if (!projectName) {
  console.log(pc.red("Error: Please specify the project name."));
  console.log(
    pc.dim("Usage: pnpm dlx @pkcarreno/create-astro-minimal <project-name>")
  );
  process.exit(1);
}

async function init() {
  const targetDir = path.join(process.cwd(), projectName);

  try {
    console.log(pc.cyan(`\nCreating project in ${pc.bold(targetDir)}...`));

    // Download template without git history
    await downloadTemplate("gh:pkcarreno/astro-minimal-template", {
      dir: targetDir,
    });

    // Remove CHANGELOG.md
    await rm(path.join(targetDir, "CHANGELOG.md"), { force: true });

    // Rename project occurrences in files
    await replaceInFile({
      files: [
        path.join(targetDir, "package.json"),
        path.join(targetDir, "README.md"),
        path.join(targetDir, "src", "pages", "index.astro"),
      ],
      from: /astro-minimal-template|Astro Minimal Template/g,
      to: projectName,
    });

    // Final output
    console.log(pc.green("\n✔ Project initialized successfully.\n"));
    console.log(pc.white(" Next steps:"));
    console.log(pc.yellow(`  cd ${projectName}`));
    console.log(pc.yellow("  pnpm install"));
    console.log(pc.dim("─".repeat(40)));
    console.log(
      pc.cyan(" Note: This project is designed to be used with pnpm.")
    );
  } catch (error) {
    console.error(pc.red("\n✖ Error:"), error.message);
    process.exit(1);
  }
}

init();
