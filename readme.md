## githooks for Deno

This is a simple tool for [Deno](https://deno.land) projects that allows you to
associate specific [deno tasks](https://deno.land/manual/tools/task_runner) with
specific [Git Hooks](https://git-scm.com/docs/githooks) by extending the native
`deno.json` configuration file or adding a separate one.

It works like this:

1. In your `deno.json` (or `deno.jsonc`) file, add a `githooks` key containing a
   map of `{githook}` to `{deno task}`. For example:

   ```json
   {
     "tasks": {
       "start": "deno run -A dev.ts",
       "check": "deno fmt --check && deno lint"
     },
     "githooks": {
       "pre-commit": "check"
     }
   }
   ```

   You can also create a separate `githooks.json`, `githooks.jsonc`,
   `githooks.yaml` or `githooks.yml` file:

   ```json
   {
     "pre-commit": "check"
   }
   ```

   ```yaml
   pre-commit: check
   ```

   To add autocompletion, you can use our JSON schema. This schema can either be
   specified in the settings of your code editor or directly in the JSON file:

   ```json
   {
     "$schema": "https://deno.land/x/githooks/schema.json",
     "pre-commit": "check"
   }
   ```

2. In your terminal, run the `githooks.ts` script. It will automatically create
   a hook file for each githook in your `deno.json` file.

   ```bash
   deno run -A -r https://deno.land/x/githooks/githooks.ts
   ```

That's it. Now your Git Hook should call `deno task check` before every commit.

---

**PROTIP:** [**deco**](https://github.com/deco-cx/deco) projects come with this
extension pre-installed in the `dev` script. You don't have to do anything, just
add `githooks` to `deno.json` and run `dev` to install the hooks transparently.

---
