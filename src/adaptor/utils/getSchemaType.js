export function getSchemaType(schema) {
  if (!schema.type && schema['x-oldref']) {
    return schema['x-oldref'].replace('#/components/schemas/', '');
  }

  return schema.type;
}