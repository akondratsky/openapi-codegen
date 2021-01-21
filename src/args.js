const remote = require('./remote.js');

async function list(provider, filter) {
  process.exitCode = await remote.list(provider, filter);
  process.exit();
}

const argv = require('yargs')
    .usage('cg [options] {[path]configName} {openapi-definition}')
    .boolean('debug')
    .alias('d','debug')
    .describe('debug','Turn on debugging information in the model')
    .string('filter')
    .describe('filter','Filter term to use with --list')
    .boolean('flat')
    .alias('f','flat')
    .describe('flat','Do not include config-name in output directory structure')
    .boolean('lint')
    .alias('l','lint')
    .describe('lint','Lint input definition')
    .string('list')
    .describe('list','List available templates for provider (og or sc)')
    .string('output')
    .alias('o','output')
    .describe('output','Specify output directory')
    .default('output','./out/')
    .boolean('stools')
    .alias('s','stools')
    .describe('stools','Use swagger-tools to validate OpenAPI 2.0 definitions')
    .string('templates')
    .alias('t','templates')
    .describe('templates','Specify templates directory')
    .boolean('verbose')
    .describe('verbose','Increase verbosity')
    .alias('v','verbose')
    .boolean('zip')
    .alias('z','zip')
    .describe('zip','Create a .zip file instead of individual files')
    .version()
    .argv;

if (argv.list) {
    list(argv.list, argv.filter);
}

module.exports = {
  argv
}
