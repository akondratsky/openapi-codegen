import sampler from 'openapi-sampler';

export function safeSample(schema, options, api) {
  try {
    return sampler.sample(schema, options, api);
  }
  catch (ex) {
    console.warn('Sampler:', ex.message);
  }
  return {};
}
