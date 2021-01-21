import { getAuthData, safeSample, specificationExtensions, convertArray } from './index.js';
import { schemaProperties,  } from '../constants.js';
import { typeMap } from '../maps.js';
import { circularClone as clone } from 'reftools/lib/clone.js';
import Case from 'case';
import safeJson from 'fast-safe-stringify';

export const convertOperation = (op, verb, path, pathItem, obj, api) => {
  let operation = {};
  operation.httpMethod = verb.toUpperCase();
  if (obj.httpMethodCase === 'original') operation.httpMethod = verb; // extension
  operation.path = path;
  operation.replacedPathName = path; //?

  operation.description = op.description;
  operation.summary = op.summary;
  operation.allParams = [];
  operation.pathParams = [];
  operation.queryParams = [];
  operation.headerParams = [];
  operation.formParams = [];
  operation.summary = op.summary;
  operation.notes = op.description;
  if (!operation.notes) {
    operation.notes = {isEmpty:true};
    operation.notes.toString = function() { return ''; };
  }
  //operation.hasMore = true; // last one gets reset to false
  operation.isResponseBinary = false; //TODO
  operation.isResponseFile = false; //TODO
  operation.baseName = 'Default';
  if (op.tags && op.tags.length) {
    operation.baseName = op.tags[0];
  }
  operation.produces = [];
  operation.consumes = [];
  operation.hasParams = false;
  operation.hasOptionalParams = false;
  operation.hasRequiredParams = false;
  operation.hasQueryParams = false;
  operation.hasFormParams = false;
  operation.hasPathParams = false;
  operation.hasHeaderParams = false;
  operation.hasBodyParam = false;
  operation.openapi = {};

  const authData = getAuthData(op.security || api.security, api);
  operation = Object.assign(operation, authData);

  let effParameters = (op.parameters || []).concat(pathItem.parameters || []);
  effParameters = effParameters.filter((param, index, self) => self.findIndex((p) => {return p.name === param.name && p.in === param.in; }) === index);

  const paramList = [];
  for (const pa in effParameters) {
    operation.hasParams = true;
    const param = effParameters[pa];
    const parameter = {};
    parameter.isHeaderParam = false;
    parameter.isQueryParam = false;
    parameter.isPathParam = false;
    parameter.isBodyParam = false;
    parameter.isFormParam = false;
    parameter.paramName = param.name;
    parameter.baseName = param.name;
    paramList.push(param.name);
    parameter.required = param.required || false;
    parameter.optional = !parameter.required;
    if (parameter.required) operation.hasRequiredParams = true;
    if (!parameter.required) operation.hasOptionalParams = true;
    parameter.dataType = typeMap(param.schema.type, parameter.required, param.schema);
    parameter['%dataType%'] = parameter.dataType; // bug in typescript-fetch template? trying to use {{{ with different delimiters
    for (const p of schemaProperties) {
      if (typeof param.schema[p] !== 'undefined') parameter[p] = param.schema[p];
    }
    parameter.example = JSON.stringify(safeSample(param.schema, {quiet:true}, api));
    parameter.isBoolean = (param.schema.type === 'boolean');
    parameter.isPrimitiveType = (!param.schema['x-oldref']);
    parameter.dataFormat = param.schema.format;
    parameter.isDate = (parameter.dataFormat == 'date');
    parameter.isDateTime = (parameter.dataFormat == 'date-time');
    parameter.description = param.description || '';
    parameter.unescapedDescription = param.description;
    parameter.defaultValue = (param.schema && typeof param.schema.default !== 'undefined') ? param.schema.default : undefined;
    parameter.isFile = false;
    parameter.isEnum = false; // TODO?
    parameter.vendorExtensions = specificationExtensions(param);
    if (param.schema && param.schema.nullable) {
      parameter.vendorExtensions['x-nullable'] = true;
    }
    if (param.style === 'form') {
      if (param.explode) {
        parameter.collectionFormat = 'multi';
      }
      else {
        parameter.collectionFormat = 'csv';
      }
    }
    else if (param.style === 'simple') {
      parameter.collectionFormat = 'csv';
    }
    else if (param.style === 'spaceDelimited') {
      parameter.collectionFormat = 'ssv';
    }
    else if (param.style === 'pipeDelimited') {
      parameter.collectionFormat = 'pipes';
    }
    if ((param['x-collectionFormat'] === 'tsv') || (param['x-tabDelimited'])) {
      parameter.collectionFormat = 'tsv';
    }

    operation.allParams.push(parameter);
    if (param.in === 'path') {
      parameter.isPathParam = true;
      operation.pathParams.push(clone(parameter));
      operation.hasPathParams = true;
    }
    if (param.in === 'query') {
      parameter.isQueryParam = true;
      operation.queryParams.push(clone(parameter));
      operation.hasQueryParams = true;
    }
    if (param.in === 'header') {
      parameter.isHeaderParam = true;
      operation.headerParams.push(clone(parameter));
      operation.hasHeaderParams = true;
    }
    /* if (param.in === 'form') { // TODO need to do this in requestBody
            parameter.isFormParam = true;
            operation.formParams.push(clone(parameter));
            operation.hasFormParams = true;
        }*/
  } // end of effective parameters

  operation.operationId = op.operationId || Case.camel((op.tags ? op.tags[0] :  '') + (paramList ? '_' + paramList.join('_') + '_' : '') + verb);
  operation.operationIdLowerCase = operation.operationId.toLowerCase();
  operation.operationIdSnakeCase = Case.snake(operation.operationId);
  operation.nickname = operation.operationId;

  operation.bodyParams = [];
  if (op.requestBody) {
    operation.openapi.requestBody = op.requestBody;
    if (op.requestBody.content) {
      const type = Object.keys(op.requestBody.content)[0];
      const contentType = Object.values(op.requestBody.content)[0];
      if (type === 'application/x-www-form-urlencoded') {
        for (const paramName in contentType.schema.properties) {
          const prop = contentType.schema.properties[paramName];
          const parameter = {};
          parameter.paramName = parameter.baseName = paramName;
          parameter.type = parameter.dataType = parameter.datatype = parameter.baseType = prop.type;
          parameter.format = parameter.dataFormat = prop.format;
          parameter.required = contentType.schema.required && contentType.schema.required.indexOf(paramName) >= 0;
          parameter.isBoolean = (parameter.type === 'boolean');
          parameter.isDate = (parameter.dataFormat === 'date');
          parameter.isDateTime = (parameter.dataFormat === 'date-time');
          parameter.isBodyParam = false;
          parameter.isFormParam = true;
          operation.allParams.push(clone(parameter));
          operation.formParams.push(clone(parameter));
          if (parameter.required) operation.hasRequiredParams = true;
          if (!parameter.required) operation.hasOptionalParams = true;
        }
        operation.hasParams = true;
        operation.hasFormParams = true;
        const mt = { mediaType: Object.keys(op.requestBody.content)[0] };
        operation.consumes.push(mt);
        operation.hasConsumes = true;
      } else {
        operation.bodyParam = {};
        operation.bodyParam.isHeaderParam = false;
        operation.bodyParam.isQueryParam = false;
        operation.bodyParam.isPathParam = false;
        operation.bodyParam.isFormParam = false;
        operation.bodyParam.isBodyParam = true;
        operation.bodyParam.isDate = false;
        operation.bodyParam.isDateTime = false;
        operation.bodyParam.baseName = 'body';
        operation.bodyParam.paramName = 'body';
        operation.bodyParam.baseType = 'object';
        operation.bodyParam.required = op.requestBody.required || false;
        operation.bodyParam.optional = !operation.bodyParam.required;
        if (operation.bodyParam.required) operation.hasRequiredParams = true;
        if (!operation.bodyParam.required) operation.hasOptionalParams = true;
        operation.bodyParam.schema = {};
        operation.bodyParam.isEnum = false; // TODO?
        operation.bodyParam.vendorExtensions = specificationExtensions(op.requestBody);
        const mt = { mediaType: Object.keys(op.requestBody.content)[0] };
        operation.consumes.push(mt);
        operation.hasConsumes = true;
        const tmp = obj.consumes.find(e => e.mediaType === mt.mediaType);
        if (!tmp) {
          obj.consumes.push(clone(mt)); // so convertArray works correctly
          obj.hasConsumes = true;
        }
        operation.bodyParam.schema = contentType.schema;
        operation.bodyParam.example = JSON.stringify(safeSample(contentType.schema, {quiet:true}, api));
        for (const p in schemaProperties) {
          if (typeof contentType.schema[p] !== 'undefined') operation.bodyParam[p] = contentType.schema[p];
        }
        if (contentType.schema['x-oldref']) {
          operation.bodyParam.type = contentType.schema['x-oldref'].replace('#/components/schemas/', '');
          operation.bodyParam.dataType = operation.bodyParam.type;
          operation.bodyParam.baseName = operation.bodyParam.type[0].toLowerCase() + operation.bodyParam.type.substr(1);
          operation.bodyParam.paramName = operation.bodyParam.baseName;
          operation.bodyParam.isPrimitiveType = false;
        } else if (contentType.schema.type) {
          operation.bodyParam.type = contentType.schema.type;
          operation.bodyParam.dataType = typeMap(contentType.schema.type, operation.bodyParam.required, contentType.schema); // this is the below mentioned
        } else {
          operation.bodyParam.dataType = typeMap('object', operation.bodyParam.required, {});
          operation.bodyParam.description = op.requestBody.description || '';
        }
        operation.bodyParam['%dataType%'] = operation.bodyParam.dataType; // bug in typescript-fetch template?
        operation.bodyParam.jsonSchema = safeJson({schema: operation.bodyParam.schema}, null, 2);
        operation.bodyParams.push(operation.bodyParam);
        operation.bodyParam.isFile = false; // TODO
        operation.hasParams = true;
        operation.hasBodyParam = true;
        operation.allParams.push(clone(operation.bodyParam));
      }
    }
  }
  operation.tags = op.tags;
  operation.imports = op.tags;
  operation.vendorExtensions = specificationExtensions(op);

  operation.responses = [];
  for (const r in op.responses) {
    if (!r.startsWith('x-')) {
      const response = op.responses[r];
      const entry = {};
      entry.code = r;
      entry.isDefault = (r === 'default');
      entry.nickname = 'response' + r;
      entry.message = response.description;
      entry.description = response.description || '';
      entry.simpleType = true;
      entry.schema = {};
      entry.jsonSchema = safeJson({ schema: entry.schema }, null, 2);
      if (response.content) {
        entry.baseType = 'object';
        entry.dataType = typeMap(entry.baseType, false, {});
        const contentType = Object.values(response.content)[0];
        const mt = {};
        mt.mediaType = Object.keys(response.content)[0];
        operation.produces.push(mt);
        operation.hasProduces = true;
        const tmp = obj.produces.find(e => e.mediaType === mt.mediaType);
        if (!tmp) {
          obj.produces.push(clone(mt)); // so convertArray works correctly
          obj.hasProduces = true;
        }
        if (contentType && contentType.schema) {
          entry.schema = contentType.schema;
          entry.jsonSchema = safeJson({schema:entry.schema}, null, 2);
          entry.baseType = contentType.schema.type;
          entry.isPrimitiveType = true;
          entry.dataType = typeMap(contentType.schema.type, false, entry.schema);
          if (contentType.schema['x-oldref']) {
            entry.dataType = contentType.schema['x-oldref'].replace('#/components/schemas/', '');
            entry.isPrimitiveType = false;
          }
        }
        if (contentType && contentType.example) {
          entry.hasExamples = true;
          if (!entry.examples) entry.examples = [];
          entry.examples.push({contentType: mt.mediaType, example: JSON.stringify(contentType.example, null, 2)});
        }
        if (contentType && contentType.examples) {
          for (const ex in contentType.examples) {
            const example = contentType.examples[ex];
            if (example.value) {
              entry.hasExamples = true;
              if (!entry.examples) entry.examples = [];
              entry.examples.push({contentType: mt.mediaType, example: JSON.stringify(example.value, null, 2)});
            }
          }
        }

        if (!entry.hasExamples && entry.schema) {
          const example = safeSample(entry.schema, {quiet:true}, api);
          if (example) {
            entry.hasExamples = true;
            if (!entry.examples) entry.examples = [];
            entry.examples.push({contentType: mt.mediaType, example:JSON.stringify(example, null, 2)});
          }
        }

        operation.examples = (operation.examples || []).concat(entry.examples || []);

        operation.returnType = entry.dataType;
        operation.returnBaseType = entry.baseType;
        operation.returnTypeIsPrimitive = entry.isPrimitiveType;
        operation.returnContainer = ((entry.baseType === 'object') || (entry.baseType === 'array'));

      }
      entry.responseHeaders = []; // TODO responseHeaders
      entry.responseHeaders = convertArray(entry.responseHeaders);
      entry.examples = convertArray(entry.examples);
      entry.openapi = {};
      entry.openapi.links = response.links;
      operation.responses.push(entry);
      operation.responses = convertArray(operation.responses);
    }

    if (obj.sortParamsByRequiredFlag) {
      operation.allParams = operation.allParams.sort(function(a, b){
        if (a.required && !b.required) return -1;
        if (b.required && !a.required) return +1;
        return 0;
      });
    }
  }
  operation.queryParams = convertArray(operation.queryParams);
  operation.headerParams = convertArray(operation.headerParams);
  operation.pathParams = convertArray(operation.pathParams);
  operation.formParams = convertArray(operation.formParams);
  operation.bodyParams = convertArray(operation.bodyParams);
  operation.allParams = convertArray(operation.allParams);
  operation.examples = convertArray(operation.examples);

  if (operation.hasConsumes) {
    operation.consumes = convertArray(operation.consumes);
  }
  else {
    delete operation.consumes;
  }
  if (operation.hasProduces) {
    operation.produces = convertArray(operation.produces);
  }
  else {
    delete operation.produces;
  }

  operation.openapi.callbacks = op.callbacks;

  //let container = {};
  //container.baseName = operation.nickname;
  //container.operation = operation;
  //obj.operations.push(container);
  return operation;
};
