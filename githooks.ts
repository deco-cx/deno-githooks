export async function readJson(filePath: string): Promise<unknown> {
  try {
    const jsonString = await Deno.readTextFile(filePath);
    return JSON.parse(jsonString);
  } catch (err) {
    err.message = `${filePath}: ${err.message}`;
    throw err;
  }
}

type DenoConfig = {
  githooks: Record<string, string[]>;
};

const denoConfig = await readJson("./deno.json") as DenoConfig;

const hooks = Object.keys(denoConfig.githooks);

for (const hook of hooks) {
  const task = denoConfig.githooks[hook];
  const hookPath = `./.git/hooks/${hook}`;
  const hookScript = `#!/bin/sh
exec deno task ${task}`;
  await Deno.writeTextFile(hookPath, hookScript);
  await Deno.chmod(hookPath, 0o755);
}
