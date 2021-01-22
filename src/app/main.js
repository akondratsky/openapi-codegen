import yaml from 'yaml';
import { defName, remoteConfig, config, configName } from './configs.js';
import { finishLocal, finishRemote } from './files.js';
import { argv } from './args.js';
import { despatch } from './despatch.js';


const finish = remoteConfig ? finishRemote : finishLocal;

export const main = (s) => {
  const o = yaml.parse(s, { prettyErrors: true });
  if (argv.verbose) console.log('Loaded definition ' + defName);

  if (o && o.openapi) {
    console.log('main() -> despatching');
    debugger;
    despatch(o, config, configName, finish);
  }
  // else {
  //   if (o && o.swaggerVersion && o.swaggerVersion === '1.2') {
  //     convert12(o);
  //   }
  //   else if (o && o.swagger && o.swagger === '2.0') {
  //     if (remoteConfig) {
  //       despatch(o,config,configName,finish);
  //     }
  //     else {
  //       convert20(o);
  //     }
  //   }
  //   else {
  //     console.error('Unrecognised OpenAPI/Swagger version');
  //   }
  // }
};
