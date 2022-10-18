import {
  generateFiles,
  joinPathFragments,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { library as libraryGenerator } from '@nativescript/nx/src/generators/library/library';

const DEBUG = false;
const flavors = [
  'angular',
  'javascript',
  'react',
  'svelte',
  'typescript',
  'vue',
];
export default async function (tree: Tree, schema: any) {
  const name = schema.name;
  await createSharedExampleLib(tree, name);
  await createFlavorApps(tree, name);
  if (!DEBUG) {
    updateJson(tree, `workspace.json`, (json) => {
      for (const flavor of flavors) {
        json.projects[`${name}-${flavor}`] = `apps/${name}/${flavor}`;
      }
      return json;
    });
  }
}

async function createSharedExampleLib(tree: Tree, name: string) {
  await libraryGenerator(tree, { name, unitTestRunner: 'none' });
  tree.delete(`libs/nativescript-${name}/src/lib/nativescript-${name}.spec.ts`);
  tree.delete(`libs/nativescript-${name}/src/lib/nativescript-${name}.ts`);
  tree.delete(`libs/nativescript-${name}/.babelrc`);
  tree.delete(`libs/nativescript-${name}/jest.config.ts`);
  tree.write(
    `libs/nativescript-${name}/references.d.ts`,
    `/// <reference path="../../references.d.ts" />`
  );
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
    `./libs/nativescript-${name}/src`,
    {
      name,
      tmpl: '',
      dot: '.',
    }
  );
}

async function createFlavorApps(tree: Tree, name: string) {
  // base flavor apps off the battery example since they should all be same setup
  const exampleCopyTargetPath = 'apps/battery';
  const batteryFlavors = tree.children(exampleCopyTargetPath);
  const ignoreFiles = ['.DS_Store'];
  const ignoreFolders = ['node_modules', 'hooks', 'platforms', 'typings'];
  const createFile = (appPath: string) => {
    const fileListing = tree.children(appPath); // Children of a flavour folder
    for (const filename of fileListing) {
      if (!ignoreFolders.includes(filename)) {
        // console.log('filename:', filename);
        let filePath = `${appPath}/${filename}`;
        if (tree.isFile(filePath)) {
          // read the file and search/replace lib with newly created example lib
          let fileContents = tree.read(filePath)!.toString('utf-8');
          if (fileContents?.indexOf('nativescript-battery') > -1) {
            fileContents = fileContents.replace(
              /nativescript-battery/gi,
              `nativescript-${name}`
            );
          }
          if (fileContents?.indexOf('apps/battery') > -1) {
            fileContents = fileContents.replace(
              /apps\/battery/gi,
              `apps/${name}`
            );
          }
          if (fileContents?.indexOf('battery-') > -1) {
            fileContents = fileContents.replace(/battery-/gi, `${name}-`);
          }
          filePath = filePath.replace(`apps/battery`, `apps/${name}`);
          if (DEBUG) {
            console.log('create:', filePath);
          } else {
            swapFileWithBoilerplate(tree, name, filePath, fileContents);

          }
        } else {
          createFile(filePath);
        }
      }
    }
  };
  for (const flavor of batteryFlavors) {
    if (DEBUG) {
      console.log('   ');
    }
    if (!ignoreFiles.includes(flavor)) {
      const flavorDir = `${exampleCopyTargetPath}/${flavor}`; // apps/battery/{flavor}
      if (DEBUG) {
        console.log('---  ', flavor, '   ---');
      }
      createFile(flavorDir);
    }
  }
}

function swapFileWithBoilerplate(tree: Tree, name: string, filePath: string, fileContents: string) {
  
  if (filePath.indexOf('angular/src/app') > -1) {
 
    if (filePath.indexOf('home.component.ts') > -1) {
      const boilerplate = <string>tree.read('tools/generators/add/files/apps/angular/src/app/home.component.ts__tmpl__')?.toString();
      fileContents = boilerplate.replace(/nativescript-battery/gi,
        `nativescript-${name}`);

    } else if (filePath.indexOf('home.component.html') > -1) {
      const boilerplate = <string>tree.read('tools/generators/add/files/apps/angular/src/app/home.component.html')?.toString();
      fileContents = boilerplate;
    }
  } else if (filePath.indexOf('react/src/components') > -1) {
    if (filePath.indexOf('HomeScreen.tsx__tmpl__') > -1) {
      const boilerplate = <string>tree.read('tools/generators/add/files/apps/react/src/components/HomeScreen.tsx__tmpl__')?.toString();
      fileContents = boilerplate.replace(/nativescript-battery/gi,
        `nativescript-${name}`);
    }
  } else if (filePath.indexOf('svelte/app/components') > -1) {

    if (filePath.indexOf('Home.svelte') > -1) {
      const boilerplate = <string>tree.read('tools/generators/add/files/apps/svelte/app/components/Home.svelte__tmpl__')?.toString();
      fileContents = boilerplate.replace(/nativescript-battery/gi,
        `nativescript-${name}`);
      fileContents = fileContents.replace(/to do/gi,
        toTitleCase(name));
    }
  } else if (filePath.indexOf('typescript/app') > -1) {
    if (filePath.indexOf('main-page.xml') > -1) {
      const boilerplate = <string>tree.read('tools/generators/add/files/apps/typescript/app/main-page.xml')?.toString();
      fileContents = boilerplate.replace(/nativescript-battery/gi,
        `nativescript-${name}`);
      fileContents = fileContents.replace(/to do/gi,
        toTitleCase(name));
    } else if (filePath.indexOf('main-view-model.ts') > -1) {
      const boilerplate = <string>tree.read('tools/generators/add/files/apps/typescript/app/main-view-model.ts__tmpl__')?.toString();
      fileContents = boilerplate.replace(/nativescript-battery/gi,
        `nativescript-${name}`);
      fileContents = fileContents.replace(/to do/gi,
        toTitleCase(name));
    }
  } else if (filePath.indexOf('vue/app/components') > -1) {
    
    if (filePath.indexOf('Home.vue') > -1) {
      const boilerplate = <string>tree.read('tools/generators/add/files/apps/vue/app/components/Home.vue__tmpl__')?.toString();
      fileContents = boilerplate.replace(/nativescript-battery/gi,
        `nativescript-${name}`);
      fileContents = fileContents.replace(/to do/gi,
        toTitleCase(name));
    }
  }

  tree.write(filePath, fileContents);
}

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function (match) {
    return match.toUpperCase();
  });
}