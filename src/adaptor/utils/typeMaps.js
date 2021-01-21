import { typeMap } from '../maps.js';
import { getSchemaType } from './index.js';

export const typeMaps = {
  nop: function(type, required, schema) {
    return type;
  },
  java: function(type, required, schema) {
    let result = type;
    if (!required) result += '?';
    return result;
  },
  javascript: function(type, required, schema) {
    let result = type;
    if (result === 'integer') result = 'number';
    return result;
  },
  typescript: function(type, required, schema) {
    let result = type;
    if (result === 'integer') result = 'number';
    if (result === 'array') {
      result = 'Array';
      if (schema.items) {
        result += '<' + typeMap(getSchemaType(schema.items), false, schema.items) + '>';
      }
    }
    return result;
  },
  go: function(type, required, schema) {
    let result = type;
    if (result === 'integer') result = 'int';
    if (result === 'boolean') result = 'bool';
    if (result === 'object') result = 'struct{}';
    if (result === 'array') {
      result = '[100]'; //!
      if (schema.items && schema.items.type) {
        result += typeMap(schema.items.type, false, schema.items);
      }
    }
    return result;
  }
};