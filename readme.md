# Deno support for githooks

See https://git-scm.com/docs/githooks and
https://deno.land/manual@v1.25.4/tools/task_runner

This is a simple tool for [deno](https://deno.land) projects that allows you to
associate specific `deno tasks` with specific `githooks` by extending the native
`deno.json` configuration file.

It works like this:

- In your `deno.json` file, add a `githooks` key containing a map of `{githook}`
  to `{deno task}`. For example:

```json
// deno.json
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

- In your terminal, run the `githooks.ts` script. It will automatically create a
  hook file for each githook in your `deno.json` file.

```bash
$ deno run -A -r https://deno.land/x/githooks/githooks.ts
```

That's it. Now your git should call `deno task check` before every commit.

---

**PROTIP:** [**deco** Live](https://github.com/deco-cx/live.ts) projects come with
this extension pre-installed in the `dev` script. You don't have to do anything,
just add `githooks` to `deno.json` and run `dev` to install the hooks
transparently.

---

## TODO

- [ ] Add support for Windows implementing something like this:
      https://github.com/denoland/deno/blob/429759fe8b4207240709c240a8344d12a1e39566/cli/tools/installer.rs#L46
