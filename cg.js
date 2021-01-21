import fs from 'fs';
import url from 'url';
import fetch from 'node-fetch';
import { defName } from './src/app/configs.js';
import { main } from './src/app/main.js';


const up = url.parse(defName);
if (up.protocol && up.protocol.startsWith('http')) {
  fetch(defName)
    .then((res) => {
      return res.text();
    }).then((body) => {
      main(body);
    }).catch((err) => {
      console.error(err.message);
    });
} else {
  main(fs.readFileSync(defName,'utf8'));
}
