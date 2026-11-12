#!/usr/bin/env node
/**
 * Turns apps/<example>/<flavor> into a standalone project that StackBlitz can
 * import straight from a GitHub branch:
 *
 *   node tools/scripts/extract-example.mjs <example> <flavor> <outDir>
 *
 * Apps reach shared code with `../../../libs/<lib>/...` paths. Every lib an app
 * references is copied to `<outDir>/libs/<lib>` and those paths are rewritten
 * to `./libs/<lib>/...`, so the published project is self-contained.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SKIP = new Set(['node_modules', 'platforms', 'hooks', 'project.json', 'package-lock.json', 'yarn.lock', '.DS_Store']);
const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.vue', '.svelte', '.xml', '.html', '.css', '.scss', '.md']);
const TEXT_DOTFILES = new Set(['.stackblitzrc', '.npmrc', '.gitignore']);
const LIB_REF = /\.\.\/\.\.\/\.\.\/libs\/([\w.-]+)\//g;

const [example, flavor, outArg] = process.argv.slice(2);
if (!example || !flavor || !outArg) {
  console.error('Usage: node tools/scripts/extract-example.mjs <example> <flavor> <outDir>');
  process.exit(1);
}

const appDir = join(ROOT, 'apps', example, flavor);
if (!existsSync(appDir)) {
  console.error(`No app at ${relative(ROOT, appDir)}`);
  process.exit(1);
}
const outDir = resolve(outArg);

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
cpSync(appDir, outDir, { recursive: true, filter: (src) => !SKIP.has(src.split(/[\\/]/).pop()) });
cpSync(join(ROOT, 'tools/assets/dot.gitignore'), join(outDir, '.gitignore'));

const textFiles = walk(outDir).filter((file) => {
  const name = file.split(/[\\/]/).pop();
  return TEXT_DOTFILES.has(name) || TEXT_EXTENSIONS.has(extname(name));
});

const libs = new Set();
for (const file of textFiles) {
  for (const [, lib] of readFileSync(file, 'utf8').matchAll(LIB_REF)) {
    libs.add(lib);
  }
}
for (const lib of libs) {
  const libSrc = join(ROOT, 'libs', lib, 'src');
  if (!existsSync(libSrc)) {
    fail(`${relative(ROOT, appDir)} references libs/${lib}, but ${relative(ROOT, libSrc)} does not exist`);
  }
  cpSync(libSrc, join(outDir, 'libs', lib, 'src'), { recursive: true, filter: (src) => !SKIP.has(src.split(/[\\/]/).pop()) });
}

for (const file of textFiles) {
  const original = readFileSync(file, 'utf8');
  const rewritten = original
    .replaceAll('../../../tools/assets/App_Resources', 'App_Resources')
    .replaceAll('../../../libs/', './libs/');
  if (rewritten.includes('../../../')) {
    fail(`${relative(outDir, file)} still points outside the project after rewriting`);
  }
  if (rewritten !== original) {
    writeFileSync(file, rewritten);
  }
}

console.log(`Extracted apps/${example}/${flavor} -> ${outDir}`);
console.log(`Bundled libs: ${libs.size ? [...libs].join(', ') : '(none)'}`);
for (const file of walk(outDir).sort()) {
  console.log(`  ${relative(outDir, file)}`);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function fail(message) {
  console.error(`extract-example: ${message}`);
  process.exit(1);
}
