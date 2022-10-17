import { generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';
import { library as libraryGenerator } from '@nativescript/nx/src/generators/library/library';

export default async function (tree: Tree, schema: any) {
  const name = schema.name;
  await libraryGenerator(tree, { name });
  tree.delete(`libs/nativescript-${name}/src/lib/nativescript-${name}.spec.ts`);
  tree.delete(`libs/nativescript-${name}/src/lib/nativescript-${name}.ts`);
  tree.write(
    `libs/nativescript-${name}/src/index.ts`,
    `/**
  * This file can be ignored when creating projects.
  * Only used for demoing apps within this workspace.
  * Should contain empty implementations
  */`
  );
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files', 'libs'),
    `./packages/nativescript-${name}/src`,
    {
      name,
      tmpl: '',
      dot: '.',
    }
  );
}
