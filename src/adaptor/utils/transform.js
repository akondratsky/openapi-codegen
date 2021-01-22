import yaml from 'yaml';
import util from 'util';
import { dereference as deref } from 'reftools/lib/dereference.js';
import stools from 'swagger-tools';
import { validateInner as validator } from 'oas-validator';
import url from 'url';
import { walkSchema as walkSchema } from 'oas-schema-walker';
import Case from 'case';
import safeJson from 'fast-safe-stringify';
import { getDefaultState as wsGetState } from 'oas-schema-walker';

import downconverter from '../../../lib/orange/downconvert.js';

import {
  getBase,
  getPrime,
  getAuthData,
  convertArray,
  convertToApis,
  convertToPaths,
  getSchemaType
} from './index.js';
import { schemaProperties } from '../constants.js';
import { setTypeMap, setReserved, reserved, typeMap, reservedWords, typeMaps } from '../maps.js';


/**
 * 
 * @param {object} api - just parsed yaml
 * @param {object} defaults - defaults from config
 * @param {function} callback
 */
export const transform = (api, defaults, callback) => {
  const lang = (defaults.language || '').toLowerCase();
  if (typeMaps[lang]) setTypeMap(typeMaps[lang]);
  if (reservedWords[lang]) setReserved(reservedWords[lang]);
  
  const base = getBase(); // default options which are hard-coded
  const prime = getPrime(api, defaults); // options which depend in some way on the api definition
  let configuration = Object.assign({}, base, prime, defaults);

  if (defaults.swagger) {
    configuration.swagger = defaults.swagger;
  } else {
    const container = {};
    container.spec = api;
    container.source = defaults.source;
    const conv = new downconverter(container);
    configuration.swagger = conv.convert();
  }

  configuration['swagger-yaml'] = yaml.stringify(configuration.swagger); // set to original if converted v2.0
  configuration['swagger-json'] = JSON.stringify(configuration.swagger, null, 2); // set to original if converted 2.0
  configuration['openapi-yaml'] = yaml.stringify(api);
  configuration['openapi-json'] = JSON.stringify(api, null, 2);

  // openapi3 extensions
  configuration.openapi = {};
  configuration.openapi.operationCounter = 1;
  configuration.openapi.version = api.openapi;
  configuration.openapi.servers = api.servers;

  const allSecurity = [];
  if (api.components && api.components.securitySchemes) {
    for (const s in api.components.securitySchemes) {
      const entry = {};
      entry[s] = api.components.securitySchemes[s];
      allSecurity.push(entry);
    }
  }
  const authData = getAuthData(allSecurity, api);
  configuration = Object.assign(configuration, authData);

  api = deref(api, api, { $ref:'x-oldref' });

  configuration.messages = [];
  const message = {};
  const vOptions = { anchors:true, lint:defaults.lint };
  if (defaults.stools && defaults.swagger) {
    stools.specs.v2_0.validate(defaults.swagger, function(err, result){
      if (err) console.error(util.inspect(err));
      if (result.errors) {
        for (const e of result.errors) {
          const message = {};
          message.level = 'Error';
          message.elementType = 'Path';
          message.message = e.message;
          message.elementId = e.path.join('/');
          configuration.messages.push(message);
          if (defaults.verbose) console.log(message);
        }
        for (const w of result.warnings) {
          const message = {};
          message.level = 'Warning';
          message.elementType = 'Path';
          message.message = w.message;
          message.elementId = w.path.join('/');
          configuration.messages.push(message);
          if (defaults.verbose) console.log(message);
        }
      }
    });
  } else {
    validator(api, vOptions)
      .then(() => {
        message.level = 'Valid';
        message.elementType = 'Context';
        message.elementId = 'None';
        message.message = 'No validation errors detected';
        configuration.messages.push(message);
        if (defaults.verbose) console.log(message);
      })
      .catch(ex => {
        message.level = 'Error';
        message.elementType = 'Context';
        message.elementId = vOptions.context.pop();
        message.message = ex.message;
        configuration.messages.push(message);
        console.error(message);
      });
  }
  if (api.servers && api.servers.length) {
    const u = api.servers[0].url;
    const up = url.parse(u);
    configuration.host = up.host;
    configuration.basePath = up.path;
    configuration.basePathWithoutHost = up.path;
  }

  configuration.consumes = [];
  configuration.produces = [];

  configuration.apiInfo = {};
  configuration.apiInfo.apis = convertToApis(api, configuration, defaults);
  configuration.apiInfo.paths = convertToPaths(api, configuration, defaults);

  configuration.produces = convertArray(configuration.produces);
  configuration.consumes = convertArray(configuration.consumes);

  if (defaults.debug) configuration.debugOperations = JSON.stringify(configuration, null, 2);

  configuration.models = [];
  if (api.components) {
    for (const s in api.components.schemas) {
      const schema = api.components.schemas[s];
      if (schema !== null) {
        const container = {};
        const model = {};
        model.name = s;
        if (configuration.modelNaming === 'snake_case') {
          model.name = Case.snake(model.name);
        }
        model.classname = model.name;
        model.classVarName = s;
        model.modelJson = safeJson(schema, null, 2);
        model.title = schema.title;
        model.unescapedDescription = schema.description;
        model.classFilename = configuration.classPrefix + model.name;
        model.modelPackage = model.name;
        model.isEnum = !!schema.enum;
        model.hasEnums = false;
        model.vars = [];
        walkSchema(schema, {}, wsGetState, function(schema, parent, state){
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
          for (const p in schemaProperties) {
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
            entry.datatypeWithEnum = s + '.' + entry.name + 'Enum';
            entry.enumName = entry.name + 'Enum';
            model.vars.push(entry);
          }
        });
        model.vars = convertArray(model.vars);
        container.model = model;
        container.importPath = model.name;
        configuration.models.push(container);
      }
    }
  }

  if (configuration.models.length === 0) {
    configuration.models = { isEmpty: true };
  }
  else {
    Object.defineProperty(configuration.models, 'isEmpty', {
      enumerable: true,
      value: false
    });
  }

  configuration.orderedModels = {};
  Object.keys(configuration.models).sort().forEach(function(key) {
    configuration.orderedModels[key] = configuration.models[key];
  });

  if (defaults.debug) configuration.debugModels = JSON.stringify(configuration.models, null, 2);

  if (callback) callback(null, configuration);
  return configuration;
};

