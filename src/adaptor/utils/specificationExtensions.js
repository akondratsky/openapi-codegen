export function specificationExtensions(obj) {
  const result = {};
  for (const k in obj) {
    if (k.startsWith('x-')) result[k] = obj[k];
  }
  return result;
}