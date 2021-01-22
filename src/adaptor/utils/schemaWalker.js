import Case from 'case';
import {
  convertArray,
  getSchemaType
} from './index.js';
import { schemaProperties } from '../constants.js';
import { reserved, typeMap } from '../maps.js';
import safeJson from 'fast-safe-stringify';


export const getSchemaWalker = ({ configuration, model, schemaKey }) => (schema, parent, state) => {
  const entry = {};
  entry.name = schema.name || schema.title;
  if (!entry.name && state.property && (state.property.startsWith('properties') ||
                state.property.startsWith('additionalProperties'))) {
    entry.name = state.property.split('/')[1];
  }

  if (entry.name) {
    entry.baseName = entry.name.toLowerCase();
  }

  if (configuration.variableNamingConvention === 'original') {
    if (configuration.modelPropertyNaming === 'snake_case') {
      entry.name = Case.snake(entry.name);
    }
  } else {
    if (configuration.variableNamingConvention === 'snake_case') {
      entry.baseName = entry.name;
      entry.name = Case.snake(entry.name);
    }
  }

  if (reserved.indexOf(entry.name) >= 0) {
    entry.name = Case.pascal(entry.name);
  }

  entry.getter = Case.camel('get_' + entry.name);
  entry.setter = Case.camel('set_' + entry.name);
  entry.description = schema.description || '';
  entry.unescapedDescription = entry.description;
  entry.required = (parent.required && parent.required.indexOf(entry.name) >= 0) || false;
  entry.isNotRequired = !entry.required;
  entry.readOnly = !!schema.readOnly;
  entry.type = typeMap(getSchemaType(schema), entry.required, schema);
  entry.dataType = entry.type; //camelCase for imported files
  entry.datatype = entry.type; //lower for other files
  entry.jsonSchema = safeJson(schema, null, 2);
  for (const p of schemaProperties) {
    if (typeof schema[p] !== 'undefined') entry[p] = schema[p];
  }
  entry.isEnum = !!schema.enum;
  entry.isString = schema.type == 'string';
  entry.isListContainer = schema.type === 'array';
  entry.isMapContainer = schema.type === 'object';
  entry.isPrimitiveType = !entry.isListContainer && !entry.isMapContainer;
  entry.isNotContainer = entry.isPrimitiveType;
  if (entry.isEnum) entry.isNotContainer = false;
  entry.isContainer = !entry.isNotContainer;
  if ((schema.type === 'object') && schema['x-oldref']) {
    entry.complexType = schema['x-oldref'].replace('#/components/schemas/', '');
  }
  if ((schema.type === 'array') && schema.items && schema.items['x-oldref']) {
    entry.itemsComplexType = schema.items['x-oldref'].replace('#/components/schemas/', '');
  }
  if ((schema.type === 'array') && schema.items && schema.items.type === 'string') {
    entry.itemsComplexType = 'string';
  }
  entry.dataFormat = schema.format;
  entry.defaultValue = schema.default;

  if (entry.isEnum) {
    model.hasEnums = true;
    entry.allowableValues = {};
    entry.allowableValues.enumVars = [];
    entry['allowableValues.values'] = schema.enum;
    entry.allowableValues.values = schema.enum;
    for (const v of schema.enum) {
      const e = { name: v, nameInCamelCase: Case.camel(v), value: '"' + v + '"' }; // insane, why aren't the quotes in the template?
      entry.allowableValues.enumVars.push(e);
    }
    entry.allowableValues.enumVars = convertArray(entry.allowableValues.enumVars);
  }

  if (entry.name && state.depth <= 1) {
    entry.nameInCamelCase = Case.pascal(entry.name); // for erlang-client
    entry.datatypeWithEnum = schemaKey + '.' + entry.name + 'Enum';
    entry.enumName = entry.name + 'Enum';
    model.vars.push(entry);
  }
};
