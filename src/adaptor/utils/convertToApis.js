import { convertOperation, convertArray } from './index.js';

export function convertToApis(source, obj, defaults) {
  let apis = [];
  for (const p in source.paths) {
    for (const m in source.paths[p]) {
      if ((m !== 'parameters') && (m !== 'summary') && (m !== 'description') && (!m.startsWith('x-'))) {
        const op = source.paths[p][m];
        let tagName = 'Default';
        if (op.tags && op.tags.length > 0) {
          tagName = op.tags[0];
        }
        let entry = apis.find(e => e.name === tagName);
        if (!entry) {
          entry = {};
          entry.name = tagName;
          //if (defaults.language === 'typescript') {
          //    entry.classname = Case.pascal(entry.name);
          //}
          //else {
          entry.classname = tagName + 'Api';
          //}
          entry.classFilename = tagName + 'Api';
          entry.classVarName = tagName; // see issue #21
          entry.packageName = obj.packageName; //! this may not be enough / sustainable. Or many props at wrong level :(
          entry.operations = {};
          entry.operations.operation = [];
          apis.push(entry);
        }
        const operation = convertOperation(op, m, p, source.paths[p], obj, source);
        entry.operations.operation.push(operation);
      }
    }
  }
  for (const t in source.tags) {
    const tag = source.tags[t];
    const entry = apis.find(e => e.name === t);
    if (entry) {
      entry.classname = tag.name + 'Api';
      entry.description = tag.description;
      entry.externalDocs = tag.externalDocs;
    }
  }
  for (const api of apis) {
    api.operations.operation = convertArray(api.operations.operation);
  }
  apis = convertArray(apis);
  return apis;
}
