# StackBlitz Examples

Examples are edited on `main` only. Each one lives in its own folder:

```
apps/{example}/{flavor}
```

Code shared across the flavors of an example lives in `libs`, e.g. `libs/nativescript-battery` is used by every `apps/battery/*` flavor. Apps import it by package name (`@stackblitz/nativescript-battery`), which each app's `webpack.config.js` aliases to the lib's `src` folder.

## How examples reach StackBlitz

Every push to `main` runs [`publish-examples.yml`](.github/workflows/publish-examples.yml), which for each `{example}/{flavor}`:

1. extracts it into a standalone project ([`tools/scripts/extract-example.mjs`](tools/scripts/extract-example.mjs)), copying in the libs it uses and rewriting `../../../` paths;
2. installs it and bundles it for iOS and Android ([`tools/scripts/verify-example.sh`](tools/scripts/verify-example.sh)), the same build `ns preview` runs;
3. pushes it to the `{example}-{flavor}` branch.

Pull requests run steps 1 and 2 without publishing.

StackBlitz opens those branches straight from GitHub, so links always show what is on `main`:

```
https://stackblitz.com/github/NativeScript/stackblitz-examples/tree/{example}-{flavor}?file={path}
```

> **Warning:** Do not edit the `{example}-{flavor}` branches; they are overwritten on every publish.

### Battery example links

| Flavor     | Link |
| ---------- | ---- |
| TypeScript | https://stackblitz.com/github/NativeScript/stackblitz-examples/tree/battery-typescript?file=app%2Fmain-page.xml |
| JavaScript | https://stackblitz.com/github/NativeScript/stackblitz-examples/tree/battery-javascript?file=app%2Fmain-page.xml |
| Angular    | https://stackblitz.com/github/NativeScript/stackblitz-examples/tree/battery-angular?file=src%2Fapp%2Fhome.component.html |
| React      | https://stackblitz.com/github/NativeScript/stackblitz-examples/tree/battery-react?file=src%2Fcomponents%2FHomeScreen.tsx |
| Solid      | https://stackblitz.com/github/NativeScript/stackblitz-examples/tree/battery-solid?file=src%2Fcomponents%2Fhome.jsx |
| Svelte     | https://stackblitz.com/github/NativeScript/stackblitz-examples/tree/battery-svelte?file=app%2Fcomponents%2FHome.svelte |
| Vue        | https://stackblitz.com/github/NativeScript/stackblitz-examples/tree/battery-vue?file=src%2Fcomponents%2FHome.vue |

## Check an example locally

Run what CI runs:

```
node tools/scripts/extract-example.mjs battery vue dist/battery-vue
tools/scripts/verify-example.sh dist/battery-vue
```

`dist/battery-vue` is then the exact project StackBlitz will load.

`@nativescript/core` stays on 8.9.x until NativeScript Preview supports v9.

# Templates

- TypeScript: https://new.nativescript.org
- Angular: https://new.nativescript.org/angular
- JavaScript: https://new.nativescript.org/javascript
- React: https://new.nativescript.org/react
- Svelte: https://new.nativescript.org/svelte
- TypeScript: https://new.nativescript.org/typescript
- Vue: https://new.nativescript.org/vue

- https://nativescript.new
- https://nativescript.new/angular
- https://nativescript.new/javascript
- https://nativescript.new/react
- https://nativescript.new/svelte
- https://nativescript.new/typescript
- https://nativescript.new/vue

<details>

<summary>
Full URLS (used in redirects)
</summary>

```
/              /typescript
/angular       https://stackblitz.com/fork/github/NativeScript/stackblitz-templates/tree/angular?file=src%2Fapp%2Fitem%2Fitems.component.html&title=NativeScript%20Starter%20Angular
/javascript    https://stackblitz.com/fork/github/NativeScript/stackblitz-templates/tree/javascript?file=app%2Fmain-page.xml&title=NativeScript%20Starter%20JavaScript
/react         https://stackblitz.com/fork/github/NativeScript/stackblitz-templates/tree/react?file=src%2Fcomponents%2FHomeScreen.tsx&title=NativeScript%20Starter%20React
/svelte        https://stackblitz.com/fork/github/NativeScript/stackblitz-templates/tree/svelte?file=app%2Fcomponents%2FHome.svelte&title=NativeScript%20Starter%20Svelte
/typescript    https://stackblitz.com/fork/github/NativeScript/stackblitz-templates/tree/typescript?file=app%2Fmain-page.xml&title=NativeScript%20Starter%20TypeScript
/vue           https://stackblitz.com/fork/github/NativeScript/stackblitz-templates/tree/vue?file=app%2Fcomponents%2FHome.vue&title=NativeScript%20Starter%20Vue
```

</details>
