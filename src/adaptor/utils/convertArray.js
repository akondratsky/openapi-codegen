import { arrayMode } from '../constants.js';

export function convertArray(arr) {
  if (!arr) arr = [];
  if (arr.length) {
    arr.isEmpty = false;
    for (let i = 0;i < arr.length;i++) {
      arr[i]['-first'] = (i === 0);
      arr[i]['-last'] = (i === arr.length - 1);
      arr[i].hasMore = (i < arr.length - 1);
    }
  }
  else arr.isEmpty = true;
  arr.toString = function() { if (arrayMode === 'length') return this.length.toString(); };
  return arr;
}