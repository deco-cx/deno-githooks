import {
  brightGreen,
  brightRed,
  gray,
} from "https://deno.land/std@0.192.0/fmt/colors.ts";
import * as jsonc from "https://deno.land/std@0.192.0/jsonc/parse.ts";
import * as yaml from "https://deno.land/std@0.192.0/yaml/parse.ts";

/* find file ---------------------------------------------------------------- */

type ConfigFile =
  | `${string}.json`
  | `${string}.jsonc`
  | `${string}.yaml`
  | `${string}.yml`;

async function findFile(
  ...paths: ConfigFile[]
): Promise<
  | Record<string, string>
  | undefined
> {
  try {
    const content = await Deno.readTextFile(paths[0]);

    const parsedContent = paths[0].endsWith(".json")
      ? JSON.parse(content)
      : paths[0].endsWith(".jsonc")
      ? jsonc.parse(content) as Record<string, string>
      : yaml.parse(content) as Record<string, string>;

    return paths[0].endsWith("deno.json") || paths[0].endsWith("deno.jsonc")
      ? (parsedContent.githooks ? parsedContent.githooks : undefined)
      : parsedContent;
  } catch (_) {
    paths.shift();

    if (paths.length > 0) {
      return await findFile(...paths);
    }
  }
}

/* setup hooks -------------------------------------------------------------- */

export async function setup({
  verbose = true,
  file,
}: {
  file?: ConfigFile;
  verbose?: boolean;
} = {}) {
  const githooks = file ? await findFile(file) : await findFile(
    "./githooks.json",
    "./githooks.jsonc",
    "./githooks.yaml",
    "./githooks.yml",
    "./deno.json",
    "./deno.jsonc",
  );

  if (!githooks) {
    return verbose &&
      console.error(brightRed("No githooks found!"));
  }

  const hooks = Object.keys(githooks);

  for (const h of hooks) {
    const task = githooks[h];
    const hookPath = `./.git/hooks/${h}`;
    const hookScript = `#!/bin/sh\nexec deno task ${task}`;

    await Deno.writeTextFile(hookPath, hookScript);

    if (Deno.build.os !== "windows") {
      await Deno.chmod(hookPath, 0o755);
    }
  }

  verbose &&
    console.info(
      gray(
        `${brightGreen("Added githooks:")} ${hooks.join(", ")}`,
      ),
    );
}

/* execute cli -------------------------------------------------------------- */

if (import.meta.main) {
  await setup();
}
