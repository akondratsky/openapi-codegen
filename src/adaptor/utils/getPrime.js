import { generatorVersion } from '../constants.js';
import { v4 as uuidv4} from 'uuid';

export const getPrime = (api, defaults) => {
  const prime = {};
  prime.classname = api.info.title.toLowerCase().split(' ').join('_').split('-').join('_');
  prime.projectName = prime.classname;
  prime.appVersion = api.info.version;
  prime.apiVersion = api.info.version;
  prime.packageVersion = api.info.version;
  prime.projectVersion = api.info.version;
  prime.version = api.info.version;
  prime.title = api.info.title;
  prime.swaggerVersion = '2.0';
  prime.generatorVersion = generatorVersion;
  prime.swaggerCodegenVersion = 'openapi-codegen-v' + prime.generatorVersion;
  prime.appDescription = api.info.description || 'No description';
  prime.projectDescription = prime.appDescription;
  prime.classVarName = 'default'; // see issue #21
  prime.exportedName = prime.classname;
  prime.packageTitle = prime.classname; /* Specifies an AssemblyTitle for the .NET Framework global assembly attributes stored in the AssemblyInfo file. */
  prime.infoEmail = api.info.contact ? api.info.contact.email : null;
  prime.appContact = prime.infoEmail;
  prime.infoUrl = api.info.contact ? api.info.contact.url : null;
  prime.licenseInfo = api.info.license ? api.info.license.name : null;
  prime.licenseUrl = api.info.license ? api.info.license.url : null;
  prime.appName = api.info.title;
  prime.host = '';
  prime.basePath = '/';
  prime.basePathWithoutHost = '/';
  prime.contextPath = '/';
  prime.packageName = 'IO.OpenAPI';
  prime.apiPackage = prime.packageName; /* package for generated api classes */
  prime.generatorPackage = 'IO.OpenAPI';
  prime.invokerPackage = 'IO.OpenAPI'; /* root package for generated code */
  prime.modelPackage = 'IO.OpenAPI'; /* package for generated models */
  prime.package = 'IO.OpenAPI.Api';
  prime.phpInvokerPackage = prime.invokerPackage; /* root package for generated php code */
  prime.perlModuleName = prime.invokerPackage; /* root module name for generated perl code */
  prime.podVersion = '1.0.0';
  prime.pythonPackageName = prime.invokerPackage; /* package name for generated python code */
  prime.clientPackage = 'IO.OpenAPI.Client';
  prime.importPath = 'IO.OpenAPI.Api.Default';
  prime.hasImport = true;
  prime.hasMore = true;
  prime.generatedDate = new Date().toString();
  prime.generatorClass = defaults.configName; // 'class ' prefix?
  prime.fullyQualifiedGeneratorClass = prime.generatorPackage + '.' + prime.generatorClass;
  prime.imports = [ { 'import': 'IO.OpenAPI.Model.Default' } ];
  prime.name = prime.classname;
  prime.classFilename = prime.classname;
  prime.jsModuleName = prime.classname;
  prime.moduleName = prime.classname;
  prime.jsProjectName = prime.classname;
  prime.baseNamespace = prime.packageName;
  prime.sourceFolder = './out/' + defaults.configName; /* source folder for generated code */
  prime.templateDir = './templates/' + defaults.configName;
  prime.implFolder = prime.sourceFolder; /* folder for generated implementation code */
  prime.library = ''; /* library template (sub-template) */
  prime.packageGuid = uuidv4(); /* The GUID that will be associated with the C# project */
  prime.optionalEmitDefaultValues = false; /* Set DataMember's EmitDefaultValue. */

  prime.packageProductName = prime.projectName; /* Specifies an AssemblyProduct for the .NET Framework global assembly attributes stored in the AssemblyInfo file. */
  prime.packageCompany = 'Smartbear Software'; /* Specifies an AssemblyCompany for the .NET Framework global assembly attributes stored in the AssemblyInfo file. */
  prime.packageAuthors = 'Swagger-Codegen authors'; /* Specifies Authors property in the .NET Core project file. */
  prime.packageCopyright = 'Copyright 2016 Smartbear Software'; /* Specifies an AssemblyCopyright for the .NET Framework global assembly attributes stored in the AssemblyInfo file. */

  //    prime.groupId = x; /* groupId in generated pom.xml */
  //    prime.artifactId = x; /* artifactId in generated pom.xml */
  //    prime.artifactVersion = x; /* artifact version in generated pom.xml */
  //    prime.artifactUrl = x; /* artifact URL in generated pom.xml */
  //    prime.scmConnection = x; /* SCM connection in generated pom.xml */
  //    prime.scmDeveloperConnection = x; /* SCM developer connection in generated pom.xml */
  //    prime.scmUrl = x; /* SCM URL in generated pom.xml */

  prime.httpUserAgent = 'OpenAPI-Codegen/' + prime.packageVersion + '/' + defaults.configName; /* HTTP user agent, e.g. codegen_csharp_api_client, default to 'Swagger-Codegen/{packageVersion}}/{language}' */
  return prime;
};
