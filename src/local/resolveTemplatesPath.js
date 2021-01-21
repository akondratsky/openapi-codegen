import path from 'path';

export const resolveTemplatesPath = (config, ...segments) => {
  if (config.templateDir) {
    segments.splice(0,1);
    return path.join(config.templateDir, ...segments);
  }
  return path.resolve('templates', ...segments);
};
