import { convertOperation, convertArray } from './index.js';

export function convertToPaths(source, obj, defaults) {
  let paths = [];
  for (const p in source.paths) {
    for (const m in source.paths[p]) {
      if ((m !== 'parameters') && (m !== 'summary') && (m !== 'description') && (!m.startsWith('x-'))) {
        const op = source.paths[p][m];
        let tagName = 'Default';
        if (op.tags && op.tags.length > 0) {
          tagName = op.tags[0];
        }
        let entry = paths.find(e => e.name === p);
        if (!entry) {
          const split = p.replace(/^\//, '').split(/\//g);
          const dirname = split.slice(0, -1).join('/');
          const filename = split.slice(-1).join('');
          // Generates class name from path using the rules
          // * the slashes are stripped out
          // * each path part is capitalised
          // * each parameter is changed to By<param>
          // i.e.
          // /users => Users
          // /users/{id} => UsersById
          // /users/{id}/delete => UsersByIdDelete
          const className = split.map(v=>v.replace(/{([^}]+)}/g, (v, v1)=>`By${v1[0].toUpperCase()}${v1.slice(1)}`).replace(/^./, (v)=>`${v[0].toUpperCase()}${v.slice(1)}`)).join('');

          entry = {};
          entry.name = p;
          //if (defaults.language === 'typescript') {
          //    entry.classname = Case.pascal(entry.name);
          //}
          //else {
          entry.classname = className + 'Api';
          //}
          entry.classDirName = dirname;
          entry.classFilename = filename;
          entry.classVarName = tagName; // see issue #21
          entry.packageName = obj.packageName; //! this may not be enough / sustainable. Or many props at wrong level :(
          entry.operations = {};
          entry.operations.operation = [];
          paths.push(entry);
        }
        const operation = convertOperation(op, m, p, source.paths[p], obj, source);
        entry.operations.operation.push(operation);
      }
    }
  }
  for (const t in source.tags) {
    const tag = source.tags[t];
    const entry = paths.find(e => e.name === t);
    if (entry) {
      entry.classname = tag.name + 'Api';
      entry.description = tag.description;
      entry.externalDocs = tag.externalDocs;
    }
  }
  for (const path of paths) {
    path.operations.operation = convertArray(path.operations.operation);
  }
  paths = convertArray(paths);
  return paths;
}
