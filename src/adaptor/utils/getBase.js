
export const getBase = () => {
  const base = {};
  base.supportingFiles = [];
  base.modelTests = [];
  base.modelDocs = [];
  base.apiTests = [];
  base.apiDocs = [];
  base.allowUnicodeIdentifiers = false; /* boolean, toggles whether unicode identifiers are allowed in names or not, default is false */
  //base.developerName = x; /* developer name in generated pom.xml */
  //base.developerEmail = x; /* developer email in generated pom.xml */
  //base.developerOrganization = x; /* developer organization in generated pom.xml */
  //base.developerOrganizationUrl = x; /* developer organization URL in generated pom.xml */
  base.gitUserId = 'Mermade'; /* Git user ID, e.g. swagger-api. */
  base.gitRepoId = 'openapi-codegen'; /* Git repo ID, e.g. swagger-codegen. */
  base.licenseName = 'Unlicense'; /* The name of the license */
  base.projectLicenseName = 'Unlicense'; /* The name of the license */
  base.licenseUrl = 'https://unlicense.org'; /* The URL of the license */
  base.projectLicenseUrl = 'https://unlicense.org'; /* The URL of the license */
  base.projectUrl = 'https://github.com/Mermade/openapi-codegen';
  base.localVariablePrefix = ''; /* prefix for generated code members and local variables */
  base.serializableModel = true; /* boolean - toggle "implements Serializable" for generated models */
  base.bigDecimalAsString = false; /* Treat BigDecimal values as Strings to avoid precision loss. */
  base.sortParamsByRequiredFlag = true; /* Sort method arguments to place required parameters before optional parameters. */
  base.useDateTimeOffset = 0; /* Use DateTimeOffset to model date-time properties */
  base.ensureUniqueParams = false; /* Whether to ensure parameter names are unique in an operation (rename parameters that are not). */
  base.optionalMethodArgument = false; /* Optional method argument, e.g. void square(int x=10) (.net 4.0+ only). */
  base.optionalAssemblyInfo = false; /* Generate AssemblyInfo.cs. */
  base.netCoreProjectFile = true; /* Use the new format (.NET Core) for .NET project files (.csproj). */
  base.useCollection = false; /* Deserialize array types to Collection<T> instead of List<T>. */
  base.interfacePrefix = ''; /* Prefix interfaces with a community standard or widely accepted prefix. */
  base.returnICollection = false; /* Return ICollection<T> instead of the concrete type. */
  base.optionalProjectFile = false; /* Generate {PackageName}.csproj. */
  base.variableNamingConvention = 'original'; /* {camelCase, PascalCase, snake_case, original, UPPERCASE} */
  base.modelPropertyNaming = 'original'; /* {camelCase, PascalCase, snake_case, original, UPPERCASE} */
  base.targetFramework = 4; /* The target .NET framework version. */
  base.modelNamePrefix = ''; /* Prefix that will be prepended to all model names. Default is the empty string. */
  base.modelNameSuffix = ''; /* Suffix that will be appended to all model names. Default is the empty string. */
  base.releaseNote = 'Minor update'; /* Release note, default to 'Minor update'. */
  base.supportsES6 = true; /* Generate code that conforms to ES6. */
  base.supportsAsync = true; /* Generate code that supports async operations. */
  base.emitJSDoc = true; /* */
  base.emitModelMethods = true; /* */
  base.excludeTests = false; /* Specifies that no tests are to be generated. */
  base.generateApiDocs = true; /* Not user-configurable. System provided for use in templates. */
  base.generateApiTests = true; /* Specifies that api tests are to be generated. */
  base.generateModelDocs = true; /* Not user-configurable. System provided for use in templates. */
  base.generateModelTests = true; /* Specifies that model tests are to be generated. */
  base.hideGenerationTimestamp = false; /* Hides the generation timestamp when files are generated. */
  base.generatePropertyChanged = true; /* Specifies that models support raising property changed events. */
  base.nonPublicApi = false; /* Generates code with reduced access modifiers; allows embedding elsewhere without exposing non-public API calls to consumers. */
  base.validatable = true; /* Generates self-validatable models. */
  base.ignoreFileOverride = '.swagger-codegen-ignore'; /* Specifies an override location for the .swagger-codegen-ignore file. Most useful on initial generation. */
  base.removeOperationIdPrefix = false; /* Remove prefix of operationId, e.g. config_getId => getId */
  base.serverPort = 8000;
  base.newline = '\n';
  base.apiDocPath = '';
  base.modelDocPath = '';
  base.classPrefix = 'cls';

  //extensions
  base.modelNaming = 'original'; /* {camelCase, PascalCase, snake_case, original, UPPERCASE} */
  return base;
};
