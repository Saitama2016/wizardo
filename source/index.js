#!/usr/bin/env node

import program from 'commander';
import { flow } from 'botas';
import {
  copy,
  getGenerators,
  log,
  replaceVariables,
  wizardoFolderExists,
} from './utils';
import { mkdirSync, statSync } from 'fs.extra';
import { join } from 'path';

import { version as v} from '../package.json';
import { templates } from './wizgenerator.config.json';


program
  .version(v, '-v, --version')

/**
 * init
 *
 * Verify that .wizardo doesn't exist
 * Create .wizardo folder
 * Create .wizardo/templates folder
 *
 */
program
  .command('init')
  .description('create the initial boilerplate for wizardo generator')
  .action(() => {
    log.command('init');
    if (wizardoFolderExists()) {
      log.msg(' - A Wizardo project already exists in this folder');
    } else {
      [ './.wizardo', './.wizardo/templates' ]
        .forEach(e => {
          mkdirSync(e);
          log.folder(e)
        });
    }
  });

/**
 * create
 *
 * Verify the uniqueness of the generator name
 * Add .wizardo/<generator>.config.json
 *
 * @param {string} generator - Name of generator. It should be in snake_case
 */
program
  .command('create <generator>')
  .description('create a new generator into .wizardo/<generator>.config.json')
  .action(generator => {
    log.command(`create ${generator}`);

    // TODO: Verify that generator is snake_case
    if (!wizardoFolderExists()) {
      log.danger('A Wizardo project was not found in the current directory');
      log.msg('   + Run `wizardo init` to create a wizardo project');
      process.exit(1);
    }

    let generators = getGenerators();
    if (generators.includes(generator)) {
      log.danger('Generator name already taken. Existing generators are:');
      log.msg(generators.reduce((acc, f) => `${acc}   + ${f}\n`, ''));
    } else {
      //run wizgenerator.config.json
      log.msg(` - New generator \`${generator}\` created`);

      // generate folders
      for (let gen of templates) {
        try {
          /**
           * Do nothing.
           * .wizardo directory already exists and is handled by init
           **/
        }
        catch (err) {
          mkdirSync(gen.destination);
          log.folder(gen.destination);
          continue;
        }
      }

      // Create files from templates
      for (let gen of templates) {
        copy(join(__dirname, "/templates/" + gen.source_template),
          replaceVariables(join(gen.destination, gen.source_template), {generator: generator}),
          data => replaceVariables(data, {generator: generator})
        );
      }
    }
  });

/**
 * run
 *
 * Run pipeline described in pipeline
 *
 * @param {string} generator - Name of generator. It should be in snake_case
 */
import { pipeline } from './pipeline';

program
  .command('run <generator>')
  .description('run generator given .wizardo/<generator>.config.json')
  .action(generator => {
    log.command(`run ${generator}`);
    let result = pipeline(generator);
    if (result === true) log.command(`run ${generator} - DONE!`)

  });

/**
 * list
 *
 * Extract generators from .wizardo/<generator>.config.json's and list them bonito
 *
 */
program
  .command('list')
  .alias('ls')
  .description('list all available generators')
  .action(() => {
    log.command('list');
    log.msg(getGenerators().reduce((acc, f) => `${acc}   - ${f}\n`, ''));
  });


program
  .command('*')
  .description('not a command')
  .action(function(cmd) {
    log.danger(`Wizardo ${v}: command \`${cmd}\` not found`);
  });

program
  .parse(process.argv);
