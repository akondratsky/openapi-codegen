import admzip from 'adm-zip';
import path from 'path';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import fs from 'fs';
import { argv } from './args.js';
import { config, configName } from './configs.js';

const zipFiles = {};

export const nop = (arg, callback) => {
  if (callback) callback(null, true);
  return true;
};

export const zipFile = (filename, contents) => {
  zipFiles[filename] = contents;
};

export const finishLocal = () => {
  if (argv.zip) {
    // create archive
    var zip = new admzip();

    // add files directly
    for (const f in zipFiles) {
      zip.addFile(f, new Buffer(zipFiles[f]), 'Created with OpenAPI-CodeGen');
    }
    // write everything to disk
    zip.writeZip(path.join(config.outputDir, configName + '.zip'));
  }
};

export const finishRemote = (err, result) => {
  const name = configName.split(':').pop();

  if (argv.verbose) console.log('Making/cleaning output directories');

  mkdirp(path.join(config.outputDir, name), function(){
    rimraf(path.join(config.outputDir, name) + '/*', function(){
      if (argv.zip) {
        fs.writeFileSync(path.join(config.outputDir, name, name + '.zip'), result);
      }
      else {
        const zip = new admzip(result);
        if (argv.verbose) {
          console.log('Unzipping...');
          const zipEntries = zip.getEntries(); // an array of ZipEntry records
          zipEntries.forEach(function(zipEntry) {
            console.log(zipEntry.entryName);
          });
        }
        zip.extractAllTo(config.outputDir, true);
      }
    });
  });
};
