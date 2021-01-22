import fs, { readFileSync, writeFileSync as createFile } from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';
import rimraf from 'rimraf-promise';
import Hogan from 'hogan.js';
import { circularClone as clone } from 'reftools/lib/clone.js'; // must preserve functios

import adaptor from '../adaptor/index.js';
import lambdas from '../../lambdas.js';
import { resolveTemplatesPath } from './resolveTemplatesPath.js';


const output = (model) => {
  console.log(`
    
  We are generating THE MODEL. Look here:

`);
  console.dir(model, {
    depth: 10
  });
  console.log(`


`);
};

function main(o, config, configName, callback) {
  const outputDir = config.outputDir || './out/';
  const verbose = config.defaults.verbose;
  config.defaults.configName = configName;

  const generator = async (err, model) => {
    if (config.generator) {
      model.generator = config.generator;
    }

    if (verbose) console.log(`Processing lambdas ${Object.keys(lambdas)}`);
    Object.keys(lambdas).forEach(key => model[key] = lambdas[key]);

    if (config.generator && config.generator.lambdas) {
      for (const lambda in config.generator.lambdas) {
        if (verbose) console.log('Processing lambda ' + lambda);
        model[lambda] = config.generator.lambdas[lambda];
      }
    }

    for (const p in config.partials) {
      const partial = config.partials[p];
      if (verbose) console.log('Processing partial ' + partial);
      config.partials[p] = readFileSync(resolveTemplatesPath(config, configName, partial), 'utf8');
    }

    const actions = [];
    for (const t in config.transformations) {
      const tx = config.transformations[t];
      if (tx.input) {
        if (verbose) console.log('Processing template ' + tx.input);
        tx.template = readFileSync(resolveTemplatesPath(config, configName, tx.input), 'utf8');
      }
      actions.push(tx);
    }

    debugger;
  
    const subDir = (config.defaults.flat ? '' : configName);

    verbose && console.log('Making/cleaning output directories');
    await mkdirp(path.join(outputDir, subDir));
    await rimraf(path.join(outputDir, subDir) + '/*');
    
    if (config.directories) {
      for (const directory of config.directories) {
        mkdirp.sync(path.join(outputDir, subDir, directory));
      }
    }

    for (const action of actions) {
      if (verbose) console.log('Rendering ' + action.output);
      let content;
      if (config.generator && config.generator.render) {
        content = config.generator.render(action.template, model, config.partials);
      } else {
        const template = Hogan.compile(action.template);
        content = template.render(model, config.partials);
      }
      createFile(path.join(outputDir, subDir, action.output), content, 'utf8');
    }

    if (config.touch) { // may not now be necessary
      const touchTmp = Hogan.compile(config.touch);
      const touchList = touchTmp.render(model, config.partials);
      const files = touchList.split('\r').join('').split('\n');
      for (let file of files) {
        file = file.trim();
        if (file) {
          if (!fs.existsSync(path.join(outputDir, subDir, file))) {
            createFile(path.join(outputDir, subDir, file), '', 'utf8');
          }
        }
      }
    }

    // generate license by default
    if (typeof config.license === 'undefined') {
      config.license = true;
    }

    if (config.license) {
      const licenseType = config.apache ? 'LICENSE' : 'UNLICENSE';
      createFile(path.join(outputDir, subDir, 'LICENSE'), readFileSync(resolveTemplatesPath({}, '_common', licenseType), 'utf8'), 'utf8');
    }

    const outer = model;

    if (config.perApi) {
      const toplevel = clone(model);
      delete toplevel.apiInfo;
      for (const pa of config.perApi) {
        const fnTemplate = Hogan.compile(pa.output);
        const template = Hogan.compile(readFileSync(resolveTemplatesPath(config, configName, pa.input), 'utf8'));
        for (const api of model.apiInfo.apis) {
          const cApi = Object.assign({}, config.defaults, pa.defaults || {}, toplevel, api);
          const filename = fnTemplate.render(cApi, config.partials);
          if (verbose) console.log('Rendering ' + filename + ' (dynamic:' + pa.input + ')');
          createFile(path.join(outputDir, subDir, filename), template.render(cApi, config.partials), 'utf8');
        }
      }
    }

    if (config.perPath) {
      const toplevel = clone(model);
      delete toplevel.apiInfo;
      for (const pa of config.perPath) {
        const fnTemplate = Hogan.compile(pa.output);
        const template = Hogan.compile(readFileSync(resolveTemplatesPath(config, configName, pa.input), 'utf8'));
        for (const pat of model.apiInfo.paths) {
          const cPath = Object.assign({}, config.defaults, pa.defaults || {}, toplevel, pat);
          const filename = fnTemplate.render(cPath, config.partials);
          const dirname = path.dirname(filename);
          if (verbose) console.log('Rendering ' + filename + ' (dynamic:' + pa.input + ')');
          mkdirp.sync(path.join(outputDir, subDir, dirname));
          createFile(path.join(outputDir, subDir, filename), template.render(cPath, config.partials), 'utf8');
        }
      }
    }

    if (config.perModel) {
      const cModels = clone(model.models);
      for (const pm of config.perModel) {
        const fnTemplate = Hogan.compile(pm.output);
        const template = Hogan.compile(readFileSync(resolveTemplatesPath(config, configName, pm.input), 'utf8'));
        for (const model of cModels) {
          outer.models = [];
          const effModel = Object.assign({}, model, pm.defaults || {});
          outer.models.push(effModel);
          const filename = fnTemplate.render(outer, config.partials);
          if (verbose) console.log('Rendering ' + filename + ' (dynamic:' + pm.input + ')');
          createFile(path.join(outputDir, subDir, filename), template.render(outer, config.partials), 'utf8');
        }
      }
    }

    if (config.perOperation) { // now may not be necessary
      for (const po of config.perOperation) {
        for (const api of outer.apiInfo.apis) {
          const cOperations = clone(api.operations);
          const fnTemplate = Hogan.compile(po.output);
          const template = Hogan.compile(readFileSync(resolveTemplatesPath(config, configName, po.input), 'utf8'));
          for (const operation of cOperations.operation) {
            model.operations = [];
            model.operations.push(operation);
            const filename = fnTemplate.render(outer, config.partials);
            if (verbose) console.log('Rendering ' + filename + ' (dynamic:' + po.input + ')');
            createFile(path.join(outputDir, subDir, filename), template.render(outer, config.partials), 'utf8');
          }
        }
      }
    }

    if (callback) callback(null, true);
  };

  adaptor.transform(o, config.defaults, generator);
}

export default {
  main : main
};

