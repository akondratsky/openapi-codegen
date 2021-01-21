import { remoteConfig } from './configs.js';

import local from '../local/index.js';
import remote from '../../remote.js';


export const despatch = (obj, config, configName, callback) => {
  const processor = remoteConfig ? remote : local;
  processor.main(obj, config, configName, callback);
};
