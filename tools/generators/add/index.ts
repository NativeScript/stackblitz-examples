import { generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';
import { library as libraryGenerator } from '@nativescript/nx/src/generators/library/library';

export default async function(tree: Tree, schema: any) {
  const name = schema.name;
  await libraryGenerator(tree, {name});
  tree.delete(`libs/nativescript-${name}/src`);
  generateFiles(tree, joinPathFragments(__dirname, 'files', 'libs'), `./packages/nativescript-${name}/src`, {
    name,
    tmpl: '',
    dot: '.',
  });
}
