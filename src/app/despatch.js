import { remoteConfig } from './configs.js';

import processor from '../local/index.js';
import remote from '../../remote.js';


export const despatch = (obj, config, configName, callback) => {
  if (remoteConfig) {
    remote.main(obj, config, configName, callback);
  }
  else {
    processor.main(obj, config, configName, callback);
  }
};
