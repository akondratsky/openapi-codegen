import path from 'path';
import yaml from 'yaml';
import fs from 'fs';
import { argv } from './args.js';
import { zipFile, nop } from './files.js';
import processor from '../local/index.js';

const configStr = argv._[0] || 'nodejs';
const defName = argv._[1] || path.resolve('defs/petstore3.json');


let configName = path.basename(configStr);

const remoteConfig = configName.indexOf(':') > -1;

let configPath = path.dirname(configStr);

if ((configPath === '.') && (!configStr.startsWith('.'))) {
  configPath = '';
}

if (!configPath) configPath = path.resolve('configs');

let configFile = path.join(configPath, configName);

if (path.extname(configFile)) {
  configName = configName.replace(path.extname(configFile),'');
} else {
  configFile += '.json';
}

// creating config
const config = remoteConfig ? { defaults: {} } : yaml.parse(fs.readFileSync(configFile,'utf8'), {prettyErrors: true});
config.outputDir = argv.output;
config.templateDir = argv.templates;

if (config.generator) {
  console.error(`
                                                                                                       ___   
                                                                                                    .'/   \\  
            .                     __  __   ___                                   .                 / /     \\ 
          .'|                    |  |/  \`.'   \`.               _.._            .'|                 | |     | 
         <  |                    |   .-.  .-.   '            .' .._|         .'  |                 | |     | 
    __    | |                    |  |  |  |  |  |    __      | '       __   <    |            __   |/\`.   .' 
 .:--.'.  | | .'''-.             |  |  |  |  |  | .:--.'.  __| |__  .:--.'.  |   | ____    .:--.'.  \`.|   |  
/ |   \\ | | |/.'''. \\            |  |  |  |  |  |/ |   \\ ||__   __|/ |   \\ | |   | \\ .'   / |   \\ |  ||___|  
\`" __ | | |  /    | |            |  |  |  |  |  |\`" __ | |   | |   \`" __ | | |   |/  .    \`" __ | |  |/___/  
 .'.''| | | |     | |            |__|  |__|  |__| .'.''| |   | |    .'.''| | |    /\\  \\    .'.''| |  .'.--.  
/ /   | |_| |     | |                            / /   | |_  | |   / /   | |_|   |  \\  \\  / /   | |_| |    | 
\\ \._,\\ '/| '.    | '.                           \\ \._,\\ '/  | |   \\ \._,\\ '/'    \\  \\  \\ \\ \\._,\\ '/\\_\\    / 
 \`--'  \`" '---'   '---'                           \`--'  \`"   |_|    \`--'  \`"'------'  '---'\`--'  \`"  \`''--'  

`);
  // let generator_path = path.resolve(configPath, config.generator);
  // config.generator = require(generator_path);
}

if (argv.verbose) {
  config.defaults.verbose = true;
  console.log('Loaded config '+configName);
}

if (argv.lint) config.defaults.lint = true;
if (argv.debug) config.defaults.debug = true;
if (argv.flat) config.defaults.flat = true;
if (argv.stools) config.defaults.stools = true;
config.defaults.source = defName;

export {
  config,
  configName,
  defName,
  remoteConfig
};
